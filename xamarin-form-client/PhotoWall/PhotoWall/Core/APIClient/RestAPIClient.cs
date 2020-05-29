using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using PhotoWall.Core.APIClient.Interface;
using PhotoWall.Core.Loggers;
using PhotoWall.Database.NoSQLCache;
using PhotoWall.Exceptions;
using PhotoWall.Services.Interface;
using Xamarin.Essentials;

namespace PhotoWall.Services.APIClient
{
    public class RestAPIClient : IRestAPIClient
    {
        private Dictionary<string, string> _headers = new Dictionary<string, string>();
        private readonly JsonSerializerSettings _serializerSettings;
        private readonly ILogger _logger;
        private readonly ILocalCache _localCache;


        public long HttpTimeOut { get; set; } = 30000;

        //Set cache expiration to 1 hour
        public long CaheExpiration { get; set; } = 60 * 60 * 1000;


        public RestAPIClient(ILogger logger, ILocalCache localCache)
        {
            _serializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                DateTimeZoneHandling = DateTimeZoneHandling.Utc,
                NullValueHandling = NullValueHandling.Ignore
            };

            _serializerSettings.Converters.Add(new StringEnumConverter());
            _localCache = localCache;
            _logger = logger;

        }

        #region Public Methods

        public void AddHttpHeader(string key, string value)
        {
            _headers.Add(key, value);
        }

        public void AddHttpHeader(IDictionary<string, string> headers)
        {
            foreach (string key in headers.Keys)
            {
                AddHttpHeader(key, headers[key]);
            }
        }

        public async Task<TResponse> GetAsync<TResponse>(string apiPath, string authToken = "", bool forceRefresh = true, CancellationToken cancallationToken = default) //where TResponse : IResponseModel
        {
            try
            {
                //Check for local cache
                if (Connectivity.NetworkAccess != NetworkAccess.Internet &&
                                        !_localCache.IsExpired(key: apiPath))
                {
                    await Task.Yield();
                    return _localCache.Get<TResponse>(key: apiPath);
                }

                using (var client = CreateHttpClient(apiPath, authToken))
                {
                    using (var requestMessage = GetHttpRequest(apiPath, HttpMethod.Get))
                    {
                        var response = await client.SendAsync(requestMessage, cancallationToken).ConfigureAwait(false);
                        await HandleResponse(response);

                        string serializedResponse = await response.Content.ReadAsStringAsync();

                        _logger.Log(serializedResponse);

                        TResponse result = await Task.Run(() =>
                            JsonConvert.DeserializeObject<TResponse>(serializedResponse, _serializerSettings));

                        //Saves the cache and pass it a timespan for expiration
                        _localCache.Set(key: apiPath, data: result, tag: null, timeSpan: TimeSpan.FromMilliseconds(CaheExpiration));

                        return result;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogException(ex);
                throw;
            }
            finally
            {

            }
        }

        public async Task<TResponse> GetAsync<TRequest, TResponse>(string apiPath, TRequest requestModel, string authToken = "", bool forceRefresh = true, CancellationToken cancallationToken = default)
        {
            try
            {
                //Check for local cache
                if (Connectivity.NetworkAccess != NetworkAccess.Internet &&
                    !_localCache.IsExpired(key: apiPath))
                {
                    await Task.Yield();

                    return _localCache.Get<TResponse>(key: apiPath);
                }

                using (var client = CreateHttpClient(apiPath, authToken))
                {
                    var content = JsonConvert.SerializeObject(requestModel);

                    using (var requestMessage = GetHttpRequest(apiPath, HttpMethod.Get, content))
                    {
                        var response = await client.SendAsync(requestMessage, cancallationToken).ConfigureAwait(false);
                        await HandleResponse(response);

                        string serializedResponse = await response.Content.ReadAsStringAsync();

                        _logger.Log(serializedResponse);

                        TResponse result = await Task.Run(() =>
                            JsonConvert.DeserializeObject<TResponse>(serializedResponse, _serializerSettings));

                        //Saves the cache and pass it a timespan for expiration
                        _localCache.Set(key: apiPath, data: result, tag: null, timeSpan: TimeSpan.FromMilliseconds(CaheExpiration));

                        return result;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogException(ex);
                throw;
            }
            finally
            {

            }
        }



        public async Task<TResponse> PostAsync<TResponse, TRequest>(string apiPath, TRequest requestModel, string authToken = "", bool forceRefresh = true, CancellationToken cancallationToken = default)
        {
            try
            {
                if (Connectivity.NetworkAccess != NetworkAccess.Internet)
                {
                    throw new HttpRequestExceptionEx(HttpStatusCode.BadGateway, "Checkout internet connection");
                }

                using (var client = CreateHttpClient(apiPath, authToken))
                {
                    var content = JsonConvert.SerializeObject(requestModel);

                    using (var requestMessage = GetHttpRequest(apiPath, HttpMethod.Post, content))
                    {
                        var response = await client.SendAsync(requestMessage, cancallationToken).ConfigureAwait(false);
                        await HandleResponse(response);

                        string serializedResponse = await response.Content.ReadAsStringAsync();

                        _logger.Log(serializedResponse);

                        TResponse result = await Task.Run(() =>
                            JsonConvert.DeserializeObject<TResponse>(serializedResponse, _serializerSettings));

                        return result;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogException(ex);
                throw;
            }
            finally
            {

            }
        }

        #endregion

        #region Private Methods
        private HttpClient CreateHttpClient(string url, string token = "")
        {
            var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri(url);

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            if (!string.IsNullOrEmpty(token))
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            }

            httpClient.Timeout = TimeSpan.FromMilliseconds(HttpTimeOut);

            return httpClient;
        }

        private HttpRequestMessage GetHttpRequest(string url, HttpMethod method, string content = null)
        {
            HttpRequestMessage message = new HttpRequestMessage(method, url);
            foreach (var header in _headers)
            {
                message.Headers.Add(header.Key, header.Value);
            }

            //message.Headers.Add("User-Agent", "PhotoWall");
            message.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            if (!string.IsNullOrEmpty(content))
            {
                message.Content = new StringContent(content, Encoding.UTF8, "application/json");
            }
            return message;
        }

        private async Task HandleResponse(HttpResponseMessage response)
        {
            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();

                if (response.StatusCode == HttpStatusCode.Forbidden ||
                    response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    throw new ServiceAuthenticationException(content);
                }

                throw new HttpRequestExceptionEx(response.StatusCode, content);
            }
        }

        #endregion

    }
}
