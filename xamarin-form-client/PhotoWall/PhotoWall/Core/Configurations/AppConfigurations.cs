using System;
using Newtonsoft.Json.Linq;
using Prism.DryIoc;
using Prism.Ioc;
using PhotoWall.Core.Loggers;
using PhotoWall.Enums;
using PhotoWall.Helpers;
using Xamarin.Forms;


namespace PhotoWall.Core.Configurations
{
    public class AppConfigurations
    {
        private string settingsFileName = "config.json";
        private AppConfigurationType _config = AppConfigurationType.QA;

        private JObject _settings = null;


        private static AppConfigurations _instance = null;
        private readonly ILogger _logger = ((PrismApplication)Application.Current).Container.Resolve<ILogger>();

        public static AppConfigurations Instance()
        {
            if (_instance == null)
                _instance = new AppConfigurations();

            return _instance;
        }

        public AppConfigurations()
        {

#if (DEBUG)
            LoadConfig(AppConfigurationType.QA);
#elif (RELEASE)
             LoadConfig(AppConfigurationType.Prod);
#endif
        }

        public void LoadConfig(AppConfigurationType config)
        {
            _config = config;

            string filePath = string.Empty;

            switch (config)
            {
                case AppConfigurationType.QA: settingsFileName = "config.json"; break;
                case AppConfigurationType.Prod: settingsFileName = "config.prod.json"; break;
            }

            try
            {
                _settings = JsonToTypeHelper<JObject>.GetTypeFromJson(settingsFileName);
            }
            catch (Exception ex)
            {
                _logger.LogException(ex);
            }
        }

        public string GetValue(string key)
        {
            var token = _settings.SelectToken(key);

            if (token == null)
            {
                return string.Empty;
            }

            return token.ToString();
        }

        public int GetInt(string key)
        {
            string str = GetValue(key);
            int intValue = 0;
            if (string.IsNullOrEmpty(str))
            {
                return intValue;
            }

            if (!int.TryParse(str, out intValue))
                throw new FormatException(string.Format("Invalid Value format in Settings file {0} - {1}", key, str));
            return intValue;

        }
        public bool GetBool(string key)
        {
            string str = GetValue(key);
            bool boolValue = false;
            if (string.IsNullOrEmpty(str))
            {
                return boolValue;
            }

            if (!bool.TryParse(str.ToLower(), out boolValue))
                throw new FormatException(string.Format("Invalid Value format in Settings file {0} - {1}", key, str));
            return boolValue;
        }
    }
}
