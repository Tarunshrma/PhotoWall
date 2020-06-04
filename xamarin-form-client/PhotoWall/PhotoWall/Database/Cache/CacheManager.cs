using System;
using Prism.DryIoc;
using PhotoWall.Core.Loggers;
using PhotoWall.Database.Cache.Interface;
using Xamarin.Forms;
using Prism.Ioc;
using System.Xml.Linq;
using Xamarin.Essentials;
using Newtonsoft.Json;
using PCLCrypto;
using System.Text;
using System.Net.Http;
using PhotoWall.Core.Security;

namespace PhotoWall.Database.Cache
{
    public class CacheManager
    {
        private static CacheManager _instance = null;
        private static ILogger _logger = null;
        private static ILocalCache _localCache = null;
        private static IEncryptionService _encryptionService = null;

        public static CacheManager Instance()
        {
            if (_instance == null)
                _instance = new CacheManager();

            return _instance;
        }

        public CacheManager()
        {
            _logger = ((PrismApplication)Application.Current)?.Container.Resolve<ILogger>();
            _localCache = ((PrismApplication)Application.Current)?.Container.Resolve<ILocalCache>();
            _encryptionService = ((PrismApplication)Application.Current)?.Container.Resolve<IEncryptionService>();
        }


        public void SaveApiResponse<T>(string key, T data, TimeSpan cacheExpiration, bool encrypted)
        {
            try
            {
                if (!encrypted)
                {
                    _localCache.Set(key, data, tag: null, cacheExpiration);
                    return;
                }

                var serializedData = JsonConvert.SerializeObject(data);
                var encyptedData = _encryptionService.EncryptString(serializedData);
                _localCache.Set(key, encyptedData, tag: null, cacheExpiration);
            }
            catch (Exception ex)
            {
                _logger.LogException(ex);
                throw ex;
            }

        }

        public T GetApiResponse<T>(string key, bool encrypted)
        {
            try
            {
                if (_localCache.IsExpired(key: key))
                {
                    return default(T);
                }

                if (!encrypted)
                {
                    T cachedResponse = _localCache.Get<T>(key: key);
                    return cachedResponse;
                }

                string cachedEncryptedResponse = _localCache.Get<string>(key: key);
                string decryptedResponse = _encryptionService.DecryptString(cachedEncryptedResponse);
                var deserializedObject = JsonConvert.DeserializeObject<T>(decryptedResponse);

                return deserializedObject;
            }
            catch (Exception ex)
            {
                _logger.LogException(ex);
                throw ex;
            }
        }

    }
}
