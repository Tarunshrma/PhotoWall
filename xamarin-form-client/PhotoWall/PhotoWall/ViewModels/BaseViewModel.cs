using System;
using Prism.DryIoc;
using Prism.Ioc;
using Prism.Mvvm;
using Prism.Navigation;
using PhotoWall.Core.Loggers;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace PhotoWall.ViewModels
{
    public class BaseViewModel : BindableBase, INavigationAware, IDestructible
    {
        protected ILogger Logger { get; private set; }

        private bool _isBusy;
        public bool IsBusy
        {
            get
            {
                return _isBusy;
            }

            set
            {
                SetProperty(ref _isBusy, value);
            }
        }

        private bool _isOffline;
        public bool IsOffline
        {
            get
            {
                return _isOffline;
            }

            set
            {
                SetProperty(ref _isOffline, value);
            }
        }

        public BaseViewModel()
        {
            Logger = ((PrismApplication)Application.Current).Container.Resolve<ILogger>();
            Connectivity.ConnectivityChanged += ConnectivityChanged;
        }

        private void ConnectivityChanged(object sender, ConnectivityChangedEventArgs e)
        {
            if (e.NetworkAccess == NetworkAccess.None ||
                e.NetworkAccess == NetworkAccess.Unknown)
            {
                IsOffline = true;
            }
            else
            {
                IsOffline = false;
            }
        }

        public void OnNavigatedFrom(INavigationParameters parameters)
        {

        }

        public void OnNavigatedTo(INavigationParameters parameters)
        {

        }

        public void Destroy()
        {
            Connectivity.ConnectivityChanged -= ConnectivityChanged;
        }
    }
}
