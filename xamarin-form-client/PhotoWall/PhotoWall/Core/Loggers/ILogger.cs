using System;
using System.Runtime.CompilerServices;

namespace PhotoWall.Core.Loggers
{
    public interface ILogger
    {
        void Log(string message);

        void Log(object message);

        void LogException(Exception exception, string message = "",
                                        [CallerMemberName] string memberName = "",
                                        [CallerFilePath] string fileName = "",
                                        [CallerLineNumber] int lineNumber = 0);
    }
}
