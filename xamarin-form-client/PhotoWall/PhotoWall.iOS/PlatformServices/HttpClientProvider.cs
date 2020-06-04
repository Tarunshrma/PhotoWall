using System;
using System.Net;
using System.Net.Http;
using PhotoWall.Core.APIClient.Interface;
using PhotoWall.Core.Configurations;

namespace PhotoWall.iOS.PlatformServices
{
    public class HttpClientProvider : IHttpClientProvider
    {
        public HttpClient GetClient()
        {
            var clientHandler = new HttpClientHandler();

            //If web proxy enabled from config then let device use default proxy
            if (AppConfigurations.Instance().GetBool("allowProxy"))
            {
                clientHandler.Proxy = CoreFoundation.CFNetwork.GetDefaultProxy();
                clientHandler.UseProxy = true;
            }

            clientHandler.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
            var client = new HttpClient(clientHandler);
            return client;
        }
    }
}
