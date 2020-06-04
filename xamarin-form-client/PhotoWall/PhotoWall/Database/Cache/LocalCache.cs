using System;
using System.IO;
using MonkeyCache;
using MonkeyCache.SQLite;
using Xamarin.Essentials;
using PhotoWall.Database.Cache.Interface;
using Newtonsoft.Json;
using PhotoWall.Core.Security;

namespace PhotoWall.Database.NoSQLCache
{
    public class LocalCache : ILocalCache
    {
        private IBarrel DBCache;
        private TimeSpan _neverExpireTimeSpan = TimeSpan.FromDays(365 * 100);
        private object _lock = new object();

        private readonly IEncryptionService _encryptionService;

        public LocalCache(IEncryptionService encryptionService)
        {
            Barrel.ApplicationId = AppInfo.Name;
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), AppInfo.Name, "MonkeyCache");
            DBCache = Barrel.Create(path);
            _encryptionService = encryptionService;
        }

        #region Cache Setters
        public void Set<T>(string key, T data, string tag)
        {
            lock (_lock)
            {
                Empty(key);
                DBCache.Add<T>(key, data, TimeSpan.FromHours(1), tag);
            }
        }

        public void Set<T>(string key, T data, string tag, TimeSpan timeSpan)
        {
            lock (_lock)
            {
                Empty(key);
                DBCache.Add<T>(key, data, timeSpan, tag);
            }
        }

        public void SetNeverExpire<T>(string key, T data, string tag)
        {
            lock (_lock)
            {
                Empty(key);
                DBCache.Add(key, data, _neverExpireTimeSpan, tag);
            }
        }
        #endregion


        #region Cache Clenaup
        public void Empty(string key)
        {
            lock (_lock)
            {
                DBCache.Empty(key);
            }
        }

        public bool Exists(string key)
        {
            lock (_lock)
            {
                return DBCache.Exists(key);
            }
        }

        public bool IsExpired(string key)
        {
            lock (_lock)
            {
                var isExpired = DBCache.IsExpired(key);
                return isExpired;
            }
        }

        /// <summary>
        /// WARNING: Deletes all cache data, do not use (only used for environment switching)
        /// </summary>
        public void EmptyAll()
        {
            lock (_lock)
            {
                DBCache.EmptyAll();
            }
        }

        public void EmptyExpired()
        {
            lock (_lock)
            {
                DBCache.EmptyExpired();
            }
        }
        #endregion


        #region Cache Retrival
        public T Get<T>(string key)
        {
            lock (_lock)
            {
                return DBCache.Get<T>(key);
            }
        }
        #endregion

        public void SaveApiResponse<T>(string key, T data, TimeSpan cacheExpiration, bool encrypted)
        {
            try
            {
                if (!encrypted)
                {
                    Set(key, data, tag: null, cacheExpiration);
                    return;
                }

                var serializedData = JsonConvert.SerializeObject(data);
                var encyptedData = _encryptionService.EncryptString(serializedData);
                Set(key, encyptedData, tag: null, cacheExpiration);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public T GetApiResponse<T>(string key, bool encrypted)
        {
            try
            {
                if (IsExpired(key: key))
                {
                    return default(T);
                }

                if (!encrypted)
                {
                    T cachedResponse = Get<T>(key: key);
                    return cachedResponse;
                }

                string cachedEncryptedResponse = Get<string>(key: key);
                string decryptedResponse = _encryptionService.DecryptString(cachedEncryptedResponse);
                var deserializedObject = JsonConvert.DeserializeObject<T>(decryptedResponse);

                return deserializedObject;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

}
