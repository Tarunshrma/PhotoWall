using System;
using System.IO;
using MonkeyCache;
using MonkeyCache.SQLite;
using Xamarin.Essentials;

namespace PhotoWall.Database.NoSQLCache
{
    public class LocalCache : ILocalCache
    {
        private IBarrel DBCache;
        private TimeSpan _neverExpireTimeSpan = TimeSpan.FromDays(365 * 100);
        private object _lock = new object();

        public LocalCache()
        {
            Barrel.ApplicationId = AppInfo.Name;
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), AppInfo.Name, "MonkeyCache");
            DBCache = Barrel.Create(path);
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

    }

}
