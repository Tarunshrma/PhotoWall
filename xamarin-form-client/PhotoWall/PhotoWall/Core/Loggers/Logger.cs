using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using Microsoft.AppCenter.Analytics;
using Microsoft.AppCenter.Crashes;

namespace PhotoWall.Core.Loggers
{
    public class Logger : ILogger
    {
        public Logger()
        {
        }

        public void Log(string message)
        {
            Debug.Write(message);
        }

        public void Log(object message)
        {
            Debug.Write(message);

        }

        public void LogException(Exception exception, string message = "",
                                        [CallerMemberName] string memberName = "",
                                        [CallerFilePath] string fileName = "",
                                        [CallerLineNumber] int lineNumber = 0)
        {
            Debug.WriteLine("Caller File Path: {0}, Caller Line Number: {1}, Caller Member: {2}", fileName, lineNumber, memberName);
            Debug.Write(exception);
            Crashes.TrackError(exception);

        }
    }
}
