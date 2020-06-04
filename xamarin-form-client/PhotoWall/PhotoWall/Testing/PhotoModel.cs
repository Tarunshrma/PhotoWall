using System;
using System.Collections;
using System.Collections.Generic;
using PhotoWall.Models;

namespace PhotoWall.Testing
{
    public class PhotoModel
    {
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public string postId { get; set; }
    }

    public class PhotoWallPosts : BaseModel
    {
        public IList<PhotoModel> Posts { get; set; }
    }
}
