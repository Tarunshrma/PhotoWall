using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using PhotoWall.Core.APIClient.Interface;

namespace PhotoWall.Services.Interface
{
    public interface IRestAPIClient
    {
        /// <summary>
        /// Add custom headers
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        void AddHttpHeader(string key, string value);

        /// <summary>
        /// Add multiple custom headers
        /// </summary>
        /// <param name="headers"></param>
        void AddHttpHeader(IDictionary<string, string> headers);

        /// <summary>
        /// Make Get API Calls
        /// </summary>
        /// <typeparam name="TResponse"></typeparam>
        /// <param name="apiPath"></param>
        /// <param name="authToken"></param>
        /// <param name="cancallationToken"></param>
        /// <returns></returns>
        Task<TResponse> GetAsync<TResponse>(string apiPath, string authToken = "", bool forceRefresh = true, CancellationToken cancallationToken = default);
        // where TResponse : IResponseModel;

        /// <summary>
        /// Get API calls with querry paramteres
        /// </summary>
        /// <typeparam name="TRequest"></typeparam>
        /// <typeparam name="TResponse"></typeparam>
        /// <param name="apiPath"></param>
        /// <param name="requestModel"></param>
        /// <param name="authToken"></param>
        /// <param name="cancallationToken"></param>
        /// <returns></returns>
        Task<TResponse> GetAsync<TRequest, TResponse>(string apiPath, TRequest requestModel, string authToken = "", bool forceRefresh = true, CancellationToken cancallationToken = default);

        /// <summary>
        /// Post API Calls with body parameeters
        /// </summary>
        /// <typeparam name="TResponse"></typeparam>
        /// <typeparam name="TRequest"></typeparam>
        /// <param name="apiPath"></param>
        /// <param name="requestModel"></param>
        /// <param name="authToken"></param>
        /// <param name="cancallationToken"></param>
        /// <returns></returns>
        Task<TResponse> PostAsync<TResponse, TRequest>(string apiPath, TRequest requestModel, string authToken = "", bool forceRefresh = true, CancellationToken cancallationToken = default);

    }
}
