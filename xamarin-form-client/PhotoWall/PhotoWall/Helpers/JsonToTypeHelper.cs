using System;
using System.IO;
using System.Reflection;
using Newtonsoft.Json;

namespace PhotoWall.Helpers
{
    public static class JsonToTypeHelper<T>
    {
        public static T GetTypeFromJson(string jsonFileName)
        {
            T typeData = default(T);

            try
            {
                var assembly = typeof(JsonToTypeHelper<T>).GetTypeInfo().Assembly;

                string filePath = string.Empty;

                foreach (var res in assembly.GetManifestResourceNames())
                {
                    var pos = res.IndexOf(jsonFileName, res.Length - jsonFileName.Length, StringComparison.Ordinal);
                    if (pos > 0)
                    {
                        filePath = res;
                        break;
                    }
                }

                using (Stream stream = assembly.GetManifestResourceStream(filePath))
                {
                    if (stream != null)
                    {
                        using (var reader = new System.IO.StreamReader(stream))
                        {
                            var str = reader.ReadToEnd();
                            typeData = JsonConvert.DeserializeObject<T>(str);
                        }
                    }
                }

                return typeData;

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

    }
}
