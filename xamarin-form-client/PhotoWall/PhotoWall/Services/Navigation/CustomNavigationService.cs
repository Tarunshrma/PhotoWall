using System;
using System.Threading.Tasks;
using Prism.DryIoc;
using Prism.Ioc;
using Prism.Navigation;
using PhotoWall.ViewModels;
using PhotoWall.Views;
using Xamarin.Essentials;
using Xamarin.Forms;

#warning DO NOT USE, NOT WORKING CURRENTLY
namespace PhotoWall.Services.Navigation
{
    public class CustomNavigationService : ICustomNavigationService
    {
        private readonly INavigationService _navigationService;
        private IContainerRegistry _containerRegistry;

        public CustomNavigationService(INavigationService navigationService)
        {
            _containerRegistry = App.IOCContainer;
            _navigationService = navigationService;

            RegisterForNavigation();
        }

        public void InitalizeRootNavigation()
        {
            _navigationService.NavigateAsync("NavigationPage/HomeView");
        }

        private void RegisterForNavigation()
        {
            _containerRegistry.RegisterForNavigation<NavigationPage>();
            _containerRegistry.RegisterForNavigation<HomeView, HomeViewModel>();

        }
    }
}
