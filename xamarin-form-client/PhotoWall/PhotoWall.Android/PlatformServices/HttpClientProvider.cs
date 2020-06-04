using System;
using System.Net;
using System.Net.Http;
using PhotoWall.Core.APIClient.Interface;
using PhotoWall.Core.Configurations;
using Xamarin.Android.Net;

namespace PhotoWall.Droid.PlatformServices
{
    public class HttpClientProvider : IHttpClientProvider
    {
        public HttpClient GetClient()
        {
            var clientHandler = new AndroidClientHandler();

            //Enable/Disable proxy based on QA setting flag
            clientHandler.UseProxy = AppConfigurations.Instance().GetBool("allowProxy");
            //Bug: with AndroidClientHandler Timeout is not working https://bugzilla.xamarin.com/show_bug.cgi?id=44673
            //Bug: But using it fixes some more important bugs for us
            clientHandler.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
            var client = new HttpClient(clientHandler);
            return client;
        }
    }
}
