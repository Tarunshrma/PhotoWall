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
    }
}
