using System;
using System.Collections;
using System.Collections.Generic;

namespace PhotoWall.Testing
{
    public class PhotoModel
    {
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public string postId { get; set; }
    }

    public class PhotoWallPosts
    {
        public IList<PhotoModel> Posts { get; set; }
    }
}
