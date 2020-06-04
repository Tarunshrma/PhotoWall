using System;
using System.Runtime.CompilerServices;
using PhotoWall.Core.Loggers;

namespace PhotoWall.UnitTesting.Mocks.Services
{
    public class MockLogger : ILogger
    {
        public void Log(string message)
        {

        }

        public void Log(object message)
        {

        }

        public void LogException(Exception exception, string message = "", [CallerMemberName] string memberName = "", [CallerFilePath] string fileName = "", [CallerLineNumber] int lineNumber = 0)
        {

        }
    }
}
