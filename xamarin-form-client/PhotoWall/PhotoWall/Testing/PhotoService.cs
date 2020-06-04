using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PhotoWall.Core.Configurations;
using PhotoWall.Helpers;
using PhotoWall.Services.Base;
using PhotoWall.Services.Interface;

namespace PhotoWall.Testing
{
    public class PhotoService : BaseRestApiService, IPhotoService
    {
        public PhotoService(IRestAPIClient restAPIClient) : base(restAPIClient)
        {

        }

        public async Task<PhotoWallPosts> GetPostsAsync()
        {
            var baseUrl = AppConfigurations.Instance().GetValue("baseUrl");
            var url = UriHelper.CombineUri(baseUrl, "dev", "posts");

            var authToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1ODkzNDI5MjgsImV4cCI6MTYyMDg3ODkyOCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.16X9mYgJWSCX_8n5iMEi3cfIqqSdnxfydZWEOsju-K4";

            try
            {
                var data = await _restAPIClient.GetAsync<PhotoWallPosts>(url, authToken, false, true);
                _logger.Log("Data Reciieved");
                return data;
            }
            catch (Exception ex)
            {
                _logger.LogException(ex);
                return null;
            }
        }
    }
}
