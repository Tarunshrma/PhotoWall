using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Moq;
using Moq.Protected;
using NUnit.Framework;
using PhotoWall.Core.Loggers;
using PhotoWall.Core.APIClient.Interface;
using PhotoWall.Core.Security;
using PhotoWall.Database.Cache;
using PhotoWall.Database.Cache.Interface;
using PhotoWall.Services.APIClient;
using Xamarin.Essentials;
using Xamarin.Essentials.Interfaces;
using PhotoWall.UnitTesting.Mocks.Models;

namespace PhotoWall.UnitTesting.Core
{
    [TestFixture]
    public class RestAPIClientTest
    {
        //Mocks
        private Mock<ILogger> _logger;
        private Mock<ILocalCache> _localCache;
        private Mock<IEncryptionService> _encryptionService;
        private Mock<IConnectivity> _connectivity;
        private Mock<IHttpClientProvider> _httpClientProvider;


        //Ssystem Under Test
        private RestAPIClient _restAPIClient;

        [SetUp]
        public void Setup()
        {
            _logger = new Mock<ILogger>();
            _localCache = new Mock<ILocalCache>();
            _connectivity = new Mock<IConnectivity>();
            _httpClientProvider = new Mock<IHttpClientProvider>();
            _encryptionService = new Mock<IEncryptionService>();



            _restAPIClient = new RestAPIClient(_logger.Object, _localCache.Object, _connectivity.Object, _httpClientProvider.Object);
        }

        [TearDown]
        public void Teardown()
        {
            _restAPIClient = null;
        }


        [Test]
        public void Test_Initalize()
        {
            //Arrange

            //Act

            //Assert
            Assert.NotNull(_restAPIClient);
            Assert.AreEqual(_restAPIClient.HttpTimeOut, 30000);
            Assert.AreEqual(_restAPIClient.CaheExpiration, 24 * 60 * 60 * 1000);
        }

        [Test]
        public void Test_GetAsyncWithNoInternetAndInValidCache()
        {
            //Arrange
            _connectivity.Setup(x => x.NetworkAccess).Returns(NetworkAccess.Unknown);

            //Act
            try
            {
                _restAPIClient.GetAsync<MockResponseModel>("", "").Wait();
                Assert.Fail();
            }
            catch (Exception)
            {
                //Assert
                Assert.Pass();
            }
        }

        [Test]
        public async void Test_GetAsyncWithNoInternetAndValidCache()
        {
            //Arrange
            var apiPath = "testAPI";
            var data = "mockData";
            //CacheManager.Instance().SaveApiResponse<MockResponseModel>(apiPath, new MockResponseModel(data), TimeSpan.FromSeconds(1), false);
            _connectivity.Setup(x => x.NetworkAccess).Returns(NetworkAccess.Unknown);

            //Act
            try
            {
                var response = await _restAPIClient.GetAsync<MockResponseModel>(apiPath, "");
                Assert.Equals(response.MockProperty, data);
            }
            catch (Exception ex)
            {
                //Assert
                Assert.Fail(ex.Message);
            }
        }

        [Test]
        public async void Test_GetAsyncWithInternetAndHttpError()
        {
            //Arrange
            _httpClientProvider.Protected().Setup<Task<HttpResponseMessage>>("SendAsync",
                                    ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                                    .ReturnsAsync(new HttpResponseMessage()
                                    {
                                        StatusCode = HttpStatusCode.InternalServerError
                                    }).Verifiable();

            _connectivity.Setup(x => x.NetworkAccess).Returns(NetworkAccess.Internet);

            //Act
            try
            {
                var response = await _restAPIClient.GetAsync<MockResponseModel>("", "");
                Assert.Fail();
            }
            catch (Exception ex)
            {
                //Assert
                Assert.Pass();
            }
        }




    }
}
