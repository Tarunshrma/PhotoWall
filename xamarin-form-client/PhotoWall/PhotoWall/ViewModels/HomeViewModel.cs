using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Prism.Commands;
using PhotoWall.Core.Loggers;
using PhotoWall.Testing;
using PhotoWall.Core.Commands;

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

        public HomeViewModel(IPhotoService photoService)
        {
            _photoService = photoService;

            FetchPhotosCommand = new CustomCommand(async () => await FetchPhotos());
        }

        private async Task FetchPhotos()
        {
            IsBusy = true;
            Posts = await _photoService.GetPostsAsync();
            Debug.Write(Posts);
            IsBusy = false;
        }

        public override void OnAppearing()
        {
            base.OnAppearing();
            FetchPhotosCommand.Execute();
        }
    }
}
