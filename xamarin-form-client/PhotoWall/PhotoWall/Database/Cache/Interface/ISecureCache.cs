using System;
using System.Threading.Tasks;

namespace PhotoWall.Database.Cache.Interface
{
    public interface ISecureCache
    {
        /// <summary>
        /// Store text in encrypted secure storage on the device.
        /// Falls back to Cache storage if device does not support Secure Storage.
        /// </summary>
        /// <returns></returns>
        Task SetSecureTextAsync(string key, string value);

        /// <summary>
        /// Get string from secure storage for the given key.
        /// </summary>
        /// <returns>string value, or default if key doesn't exist.</returns>
        Task<string> GetSecureTextAsync(string key);

        /// <summary>
        /// Deletes the given key from secure storage.
        /// </summary>
        /// <param name="key">The key to delete</param>
        /// <returns>bool success</returns>
        bool DeleteKey(string key);
    }
}
