using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Prism.Commands;
using PhotoWall.Core.Loggers;
using PhotoWall.Testing;

namespace PhotoWall.ViewModels
{
    public class HomeViewModel : BaseViewModel
    {
        private readonly IPhotoService _photoService;

        public DelegateCommand FetchPhotosCommand { get; private set; }

        public HomeViewModel(IPhotoService photoService)
        {
            _photoService = photoService;

            FetchPhotosCommand = new DelegateCommand(async () => await FetchPhotos());
        }

        private async Task FetchPhotos()
        {
            IsBusy = true;
            var photos = await _photoService.GetPostsAsync();
            Debug.Write(photos);
            IsBusy = false;
        }
    }
}
