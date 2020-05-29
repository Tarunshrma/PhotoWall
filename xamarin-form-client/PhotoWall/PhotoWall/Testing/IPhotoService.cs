using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PhotoWall.Testing
{
    public interface IPhotoService
    {
        Task<PhotoWallPosts> GetPostsAsync();
    }
}
