using System;
using System.Text;
using System.Threading.Tasks;
using PCLCrypto;
using PhotoWall.Core.Loggers;
using PhotoWall.Database.Cache.Interface;
using Xamarin.Essentials;
using Xamarin.Forms.Internals;

namespace PhotoWall.Database.Cache
{
    public class SecureCache : ISecureCache
    {
        private readonly ILogger _logger;

        public SecureCache(ILogger logger)
        {
            _logger = logger;
        }

        public bool DeleteKey(string key)
        {
            try
            {
                return SecureStorage.Remove(key);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error deleting key from secure storage. {ex.Message}");
                return false;
            }
        }

        public async Task<string> GetSecureTextAsync(string key)
        {
            string result = null;

            try
            {
                //Secure Storage returns null if the key does not exist in the storage.
                result = await SecureStorage.GetAsync(key);
            }
            catch (Exception ex)
            {
                _logger.Log($"Secure Storage not supported on device.  {ex.Message}");
            }

            return result ?? default;
        }

        public async Task SetSecureTextAsync(string key, string value)
        {
            try
            {
                await SecureStorage.SetAsync(key, value);
            }
            catch (Exception ex)
            {
                _logger.Log($"Secure Storage not supported on device.  {ex.Message}");
            }
        }


    }
}
