using System;
using Prism.Commands;

namespace PhotoWall.Core.Commands
{
    public class CustomCommand : DelegateCommand
    {
        private readonly Action _execute;

        public CustomCommand(Action action) : base(action)
        {
            _execute = action;
        }

        protected override void Execute(object parameter)
        {
            base.Execute(parameter);
        }
    }
}
