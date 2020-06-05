using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Prism.Commands;
using PhotoWall.Core.Loggers;
using PhotoWall.Testing;
using PhotoWall.Core.Commands;
using Microsoft.AppCenter.Crashes;

namespace PhotoWall.ViewModels
{
    public class HomeViewModel : BaseViewModel
    {
        private readonly IPhotoService _photoService;


        private PhotoWallPosts _posts;
        public PhotoWallPosts Posts
        {
            get
            {
                return _posts;
            }

            set
            {
                SetProperty(ref _posts, value);
            }
        }

        public CustomCommand FetchPhotosCommand { get; private set; }

        public CustomCommand CrashMeCommand { get; private set; }

        public HomeViewModel(IPhotoService photoService)
        {
            _photoService = photoService;

            FetchPhotosCommand = new CustomCommand(async () => await FetchPhotos());

            CrashMeCommand = new CustomCommand(() => CrashMe());
        }

        private void CrashMe()
        {
            Crashes.GenerateTestCrash();
        }

        private async Task FetchPhotos()
        {
            Microsoft.AppCenter.Analytics.Analytics.TrackEvent("Refreshing Posts");


            IsBusy = true;
            Posts = await _photoService.GetPostsAsync();
            Debug.Write(Posts);
            IsBusy = false;
        }

        public override void OnAppearing()
        {
            Microsoft.AppCenter.Analytics.Analytics.TrackEvent("Screeen Loading");
            base.OnAppearing();
            FetchPhotosCommand.Execute();
        }
    }
}
