using System;
using System.Net.Http;

namespace PhotoWall.Core.APIClient.Interface
{
    public interface IHttpClientProvider
    {
        HttpClient GetClient();
    }
}
