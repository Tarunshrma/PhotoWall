using System;
using PhotoWall.Core.APIClient.Interface;
using PhotoWall.Droid.PlatformServices;
using Prism;
using Prism.Ioc;

namespace PhotoWall.Droid.Setup
{
    public class AndroidInitializer : IPlatformInitializer
    {
        public AndroidInitializer()
        {
        }

        public void RegisterTypes(IContainerRegistry containerRegistry)
        {
            containerRegistry.Register<IHttpClientProvider, HttpClientProvider>();
        }
    }
}
