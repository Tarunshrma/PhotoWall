using System;
using PhotoWall.Core.APIClient.Interface;

namespace PhotoWall.UnitTesting.Mocks.Models
{
    public class MockResponseModel : IResponseModel
    {
        public MockResponseModel(string mockProperty)
        {
            _mockProperty = mockProperty;
        }

        private string _mockProperty;
        public string MockProperty
        {
            get => _mockProperty;
            set
            {
                _mockProperty = value;
            }
        }

        public string Etag { get; set; }
    }
}
