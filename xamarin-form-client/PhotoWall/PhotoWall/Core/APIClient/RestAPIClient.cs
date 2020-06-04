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
using PhotoWall.Database.Cache;
using PhotoWall.Database.Cache.Interface;
using PhotoWall.Exceptions;
using PhotoWall.Resources.Resx;
using PhotoWall.Services.Interface;
using Xamarin.Essentials;
using Xamarin.Essentials.Interfaces;

namespace PhotoWall.Services.APIClient
{
    public class RestAPIClient : IRestAPIClient
    {
        private Dictionary<string, string> _headers = new Dictionary<string, string>();
        private readonly JsonSerializerSettings _serializerSettings;
        private readonly ILogger _logger;
        private readonly ILocalCache _localCache;
        private readonly IConnectivity _connectivity;
        private readonly IHttpClientProvider _httpClientProvider;


        public long HttpTimeOut { get; set; } = 30000;
        public long CaheExpiration { get; set; } = 24 * 60 * 60 * 1000;

        //Set cache expiration to 1 hour

        public RestAPIClient(ILogger logger, ILocalCache localCache, IConnectivity connectivity, IHttpClientProvider httpClientProvider)
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
            _connectivity = connectivity;
            _httpClientProvider = httpClientProvider;

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

        public async Task<TResponse> GetAsync<TResponse>(string apiPath, string authToken = "", bool forceRefresh = false, bool cacheSecurely = false, CancellationToken cancallationToken = default)
                    where TResponse : IResponseModel
        {
            try
            {
                TResponse cachedResponse = CacheManager.Instance().GetApiResponse<TResponse>(apiPath, cacheSecurely);

                //If no internet connection 
                if (_connectivity.NetworkAccess != NetworkAccess.Internet)
                {
                    //and valid cache data is available then return it
                    if (cachedResponse != null && !forceRefresh)
                    {
                        await Task.Yield();
                        return cachedResponse;
                    }
                    else
                    {
                        throw new HttpRequestExceptionEx(HttpStatusCode.BadGateway, AppResources.No_Internet);
                    }
                }

                using (var client = CreateHttpClient(apiPath, authToken))
                {
                    using (var requestMessage = GetHttpRequest(apiPath, HttpMethod.Get, null, cachedResponse?.Etag))
                    {
                        var response = await client.SendAsync(requestMessage, cancallationToken).ConfigureAwait(false);
                        await HandleResponse(response);

                        //If there is no change in api response then just return the cached response
                        if (response.StatusCode == HttpStatusCode.NotModified)
                        {
                            _logger.Log($"No new content available returning cahced response : {cachedResponse} ");
                            return cachedResponse;
                        }

                        string serializedResponse = await response.Content.ReadAsStringAsync();

                        _logger.Log(serializedResponse);

                        TResponse result = await Task.Run(() =>
                            JsonConvert.DeserializeObject<TResponse>(serializedResponse, _serializerSettings));

                        ///Saves the cache and pass it a timespan for expiration
                        // If a ETag is provided with the response, cache it for future requests
                        if (!string.IsNullOrWhiteSpace(response.Headers.ETag?.Tag))
                        {
                            result.Etag = response.Headers.ETag?.Tag;
                        }

                        //_localCache.Set(key: apiPath, data: result, tag: null, timeSpan: TimeSpan.FromMilliseconds(CaheExpiration));
                        CacheManager.Instance().SaveApiResponse<TResponse>(apiPath, result, TimeSpan.FromMilliseconds(CaheExpiration), cacheSecurely);

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

        public async Task<TResponse> GetAsync<TRequest, TResponse>(string apiPath, TRequest requestModel, string authToken = "", bool forceRefresh = false, bool cacheSecurely = false, CancellationToken cancallationToken = default)
                where TResponse : IResponseModel
        {
            try
            {
                TResponse cachedResponse = CacheManager.Instance().GetApiResponse<TResponse>(apiPath, cacheSecurely);

                //If no internet connection 
                if (_connectivity.NetworkAccess != NetworkAccess.Internet)
                {
                    //and valid cache data is available then return it
                    if (cachedResponse != null && !forceRefresh)
                    {
                        await Task.Yield();
                        return cachedResponse;
                    }
                    else
                    {
                        throw new HttpRequestExceptionEx(HttpStatusCode.BadGateway, AppResources.No_Internet);
                    }
                }


                //Check for Etag
                using (var client = CreateHttpClient(apiPath, authToken))
                {
                    var content = JsonConvert.SerializeObject(requestModel);

                    using (var requestMessage = GetHttpRequest(apiPath, HttpMethod.Get, content, cachedResponse?.Etag))
                    {
                        var response = await client.SendAsync(requestMessage, cancallationToken).ConfigureAwait(false);
                        await HandleResponse(response);

                        //If there is no change in api response then just return the cached response
                        if (response.StatusCode == HttpStatusCode.NotModified)
                        {
                            _logger.Log($"No new content available returning cahced response : {cachedResponse} ");
                            return cachedResponse;
                        }

                        string serializedResponse = await response.Content.ReadAsStringAsync();

                        _logger.Log(serializedResponse);

                        TResponse result = await Task.Run(() =>
                            JsonConvert.DeserializeObject<TResponse>(serializedResponse, _serializerSettings));

                        //Saves the cache and pass it a timespan for expiration
                        // If a ETag is provided with the response, cache it for future requests
                        if (!string.IsNullOrWhiteSpace(response.Headers.ETag?.Tag))
                        {
                            result.Etag = response.Headers.ETag?.Tag;
                        }

                        CacheManager.Instance().SaveApiResponse<TResponse>(apiPath, result, TimeSpan.FromMilliseconds(CaheExpiration), cacheSecurely);

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



        public async Task<TResponse> PostAsync<TResponse, TRequest>(string apiPath, TRequest requestModel, string authToken = "", bool forceRefresh = true, bool cacheSecurely = false, CancellationToken cancallationToken = default)
        {
            try
            {
                if (_connectivity.NetworkAccess != NetworkAccess.Internet)
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
        private HttpClient CreateHttpClient(string url, string token)
        {
            var httpClient = _httpClientProvider.GetClient();
            httpClient.BaseAddress = new Uri(url);

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            if (!string.IsNullOrEmpty(token))
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            }

            httpClient.Timeout = TimeSpan.FromMilliseconds(HttpTimeOut);

            return httpClient;
        }

        private HttpRequestMessage GetHttpRequest(string url, HttpMethod method, string content = null, string etag = null)
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

            if (!string.IsNullOrWhiteSpace(etag))
            {
                message.Headers.IfNoneMatch.Clear();
                message.Headers.IfNoneMatch.Add(new EntityTagHeaderValue(etag));
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
