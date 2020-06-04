using System;
namespace PhotoWall.Core.Security
{
    public interface IEncryptionService
    {
        string EncryptString(string text);
        string DecryptString(string text);
    }
}
