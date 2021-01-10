import { LoggerContextStack } from './types';

export const warn = (...args: Array<any>) => {
  console.warn.call(null, ...args);
};

export const log = (...args: Array<any>) => {
  console.log.call(null, ...args);
};

export enum LogActivityType {
  WARNING,
  ERROR,
  INFO,
}

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
  let messageColor = '#00529B';

  switch (type) {
    case LogActivityType.ERROR:
      messageColor = '#D8000C';
      break;
    case LogActivityType.INFO:
      messageColor = '#00529B';
      break;
    case LogActivityType.WARNING:
      messageColor = '#9F6000';
      break;
  }

  const titleStyle = 'color: #7cb305; font-weight: bold';
  const messageStyle = `color: ${messageColor}; font-weight: bold`;

  if (process && process.env.NODE_ENV !== 'production') {
    const loggerContextLength = loggerContextStack.length;
    const current = loggerContextStack[loggerContextLength - 1];
    if (current && current.enableLog) {
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
