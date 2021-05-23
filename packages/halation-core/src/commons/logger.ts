import { LoggerContextStack, LogActivityType } from '../types';

export const warn = (...args: Array<any>) => {
  console.warn.call(null, ...args);
};

export const log = (...args: Array<any>) => {
  console.log.call(null, ...args);
};

const NODE_ENV = process.env.NODE_ENV;

const loggerContextStack = [] as Array<LoggerContextStack>;

export const setLoggerContext = ({ enableLog }: { enableLog: boolean }) => {
  loggerContextStack.push({ enableLog });
  return () => loggerContextStack.pop();
};

export const logActivity = (
  moduleName: string,
  {
    message,
    value,
    type,
  }: { message: string; value?: any; type?: LogActivityType }
) => {
  if (NODE_ENV === 'production') return;

  const title: string = `[${moduleName}]`;
  let messageColor = '#73d13d';

  switch (type) {
    case LogActivityType.ERROR:
      messageColor = '#D8000C';
      break;
    case LogActivityType.INFO:
      messageColor = '#73d13d';
      break;
    case LogActivityType.WARNING:
      messageColor = '#9F6000';
      break;
  }

  const titleStyle = 'color: #b7eb8f; font-weight: bold';
  const messageStyle = `color: ${messageColor}; font-weight: bold`;

  if (process && process.env.NODE_ENV !== 'production') {
    const loggerContextLength = loggerContextStack.length;
    const current = loggerContextStack[loggerContextLength - 1];

    // warning or error should always be logged
    if (
      type === LogActivityType.ERROR ||
      type === LogActivityType.WARNING ||
      (current && current.enableLog)
    ) {
      console.log.apply(null, [
        '%c' + title + ' %c' + message,
        titleStyle,
        messageStyle,
        value ? value : '',
        Date.now(),
      ]);
    }
  }
};
