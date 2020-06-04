using System;
using System.Text;
using PCLCrypto;
using PhotoWall.Core.Configurations;

namespace PhotoWall.Core.Security
{
    public class EncryptionService : IEncryptionService
    {
        private string _seed;

        public EncryptionService()
        {
            _seed = AppConfigurations.Instance().GetValue("encryptionSeed");
        }

        public string DecryptString(string text)
        {
            if (string.IsNullOrEmpty(text)) return string.Empty;

            byte[] keyMaterial = GetMD5Hash(_seed);
            byte[] data = WinRTCrypto.CryptographicBuffer.DecodeFromBase64String(text);
            var provider = WinRTCrypto.SymmetricKeyAlgorithmProvider.OpenAlgorithm(SymmetricAlgorithm.AesCbcPkcs7);
            var key = provider.CreateSymmetricKey(keyMaterial);
            byte[] plainText = WinRTCrypto.CryptographicEngine.Decrypt(key, data, null);
            var strDecrypted = WinRTCrypto.CryptographicBuffer.ConvertBinaryToString(Encoding.UTF8, plainText);

            return strDecrypted;
        }

        public string EncryptString(string text)
        {
            if (string.IsNullOrEmpty(text)) return string.Empty;

            byte[] keyMaterial = GetMD5Hash(_seed);
            byte[] data = WinRTCrypto.CryptographicBuffer.ConvertStringToBinary(text, Encoding.UTF8);
            var provider = WinRTCrypto.SymmetricKeyAlgorithmProvider.OpenAlgorithm(SymmetricAlgorithm.AesCbcPkcs7);
            var key = provider.CreateSymmetricKey(keyMaterial);
            byte[] cipherText = WinRTCrypto.CryptographicEngine.Encrypt(key, data, null);
            var strEncrypted = WinRTCrypto.CryptographicBuffer.EncodeToBase64String(cipherText);

            return strEncrypted;
        }

        private byte[] GetMD5Hash(string key)
        {
            // Convert the message string to binary data.
            var buffUtf8Msg = WinRTCrypto.CryptographicBuffer.ConvertStringToBinary(key, Encoding.UTF8);

            // Create a HashAlgorithmProvider object.
            var objAlgProv = WinRTCrypto.HashAlgorithmProvider.OpenAlgorithm(HashAlgorithm.Md5);

            // Hash the message.
            var buffHash = objAlgProv.HashData(buffUtf8Msg);

            // Verify that the hash length equals the length specified for the algorithm.
            if (buffHash.Length != objAlgProv.HashLength)
            {
                throw new Exception("There was an error creating the hash");
            }

            return buffHash;
        }
    }
}
