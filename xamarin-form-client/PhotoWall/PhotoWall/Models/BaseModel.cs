using System;
using PhotoWall.Core.APIClient.Interface;

namespace PhotoWall.Models
{
    public class BaseModel : IResponseModel
    {
        public string Etag { get; set; } = null;

        public BaseModel()
        {
        }


    }
}
