using System;
using Prism.DryIoc;
using PhotoWall.Core.Loggers;
using PhotoWall.Services.Interface;
using Xamarin.Forms;
using Prism.Ioc;

namespace PhotoWall.Services.Base
{
    abstract public class BaseRestApiService
    {
        protected readonly IRestAPIClient _restAPIClient;
        protected readonly ILogger _logger;

        public BaseRestApiService(IRestAPIClient restAPIClient)
        {
            _restAPIClient = restAPIClient;
            _logger = ((PrismApplication)Application.Current).Container.Resolve<ILogger>();
        }
    }
}
