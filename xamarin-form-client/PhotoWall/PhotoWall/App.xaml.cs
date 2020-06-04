using DryIoc;
using Prism;
using Prism.DryIoc;
using Prism.Ioc;
using PhotoWall.Core.Loggers;
using PhotoWall.Database.NoSQLCache;
using PhotoWall.Services.APIClient;
using PhotoWall.Services.Interface;
using PhotoWall.Services.Navigation;
using PhotoWall.Testing;
using PhotoWall.ViewModels;
using PhotoWall.Views;
using Xamarin.Forms;
using PhotoWall.Database.Cache.Interface;
using PhotoWall.Core.Security;
using PhotoWall.Database.Cache;
using PhotoWall.Analytics;
using Xamarin.Essentials.Interfaces;
using Xamarin.Essentials.Implementation;
using Xamarin.Essentials;

namespace PhotoWall
{
    public partial class App : PrismApplication
    {
        public static IContainerRegistry IOCContainer { get; set; }

        private ICustomNavigationService _customNavigationService;

        protected override void OnStart()
        {
        }

        protected override void OnSleep()
        {
        }

        protected override void OnResume()
        {
        }

        public App() : this(null) { }

        public App(IPlatformInitializer initializer) : base(initializer) { }

        protected override async void OnInitialized()
        {
            InitializeComponent();

            //_customNavigationService = IOCContainer.GetContainer().Resolve<ICustomNavigationService>();
            //_customNavigationService = this.Container.Resolve<ICustomNavigationService>();
            //_customNavigationService.InitalizeRootNavigation();
            //await NavigationService.NavigateAsync("HomeView");
            await NavigationService.NavigateAsync("NavigationPage/HomeView");
        }

        protected override void RegisterTypes(IContainerRegistry containerRegistry)
        {
            IOCContainer = containerRegistry;

            containerRegistry.RegisterForNavigation<NavigationPage>();
            containerRegistry.RegisterForNavigation<HomeView, HomeViewModel>();

            RegisterServices();
            RegisterXamarinEssentialServices();
        }

        private void RegisterServices()
        {
            //containerRegistry.RegisterSingleton<ICustomNavigationService, CustomNavigationService>();
            IOCContainer.RegisterSingleton<ILogger, Logger>();
            IOCContainer.RegisterSingleton<ILocalCache, LocalCache>();
            IOCContainer.RegisterSingleton<ISecureCache, SecureCache>();
            IOCContainer.RegisterSingleton<IEncryptionService, EncryptionService>();
            IOCContainer.RegisterSingleton<IRestAPIClient, RestAPIClient>();
            IOCContainer.RegisterSingleton<IAnalyticsService, AnalyticsService>();

            IOCContainer.Register<IPhotoService, PhotoService>();
        }

        private void RegisterXamarinEssentialServices()
        {
            IOCContainer.Register<IConnectivity, ConnectivityImplementation>();
        }
    }
}
