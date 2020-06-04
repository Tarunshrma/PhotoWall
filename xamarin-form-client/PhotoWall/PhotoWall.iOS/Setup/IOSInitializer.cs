using System;
using PhotoWall.Core.APIClient.Interface;
using PhotoWall.iOS.PlatformServices;
using Prism;
using Prism.Ioc;

namespace PhotoWall.iOS.Setup
{
    public class IOSInitializer : IPlatformInitializer
    {
        public IOSInitializer()
        {
        }

        public void RegisterTypes(IContainerRegistry containerRegistry)
        {
            containerRegistry.Register<IHttpClientProvider, HttpClientProvider>();
        }
    }
}
