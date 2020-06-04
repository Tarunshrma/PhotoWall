using System;
namespace PhotoWall.Database.Cache.Interface
{
    public interface ILocalCache
    {
        void Set<T>(string key, T data, string tag);

        void Set<T>(string key, T data, string tag, TimeSpan timeSpan);

        void SetNeverExpire<T>(string key, T data, string tag);

        void Empty(string key);

        bool Exists(string key);

        bool IsExpired(string key);

        void EmptyAll();

        void EmptyExpired();

        T Get<T>(string key);

        void SaveApiResponse<T>(string key, T data, TimeSpan cacheExpiration, bool encrypted);

        T GetApiResponse<T>(string key, bool encrypted);
    }
}
