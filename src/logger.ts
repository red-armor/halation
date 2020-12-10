export const warn = (...args: Array<any>) => {
  console.warn.call(null, ...args);
};

export const log = (...args: Array<any>) => {
  console.log.call(null, ...args);
};

export const error = (props: { type: string; message: string }) => {
  const { message, type } = props;
  console.error(message, type);
};

export enum LogActivityType {
  WARNING,
  ERROR,
  INFO,
}

export const logActivity = (
  moduleName: string,
  {
    message,
    value,
    type,
  }: { message: string; value?: any; type?: LogActivityType }
) => {
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
    console.log.apply(null, [
      '%c' + title + ' %c' + message,
      titleStyle,
      messageStyle,
      value ? value : '',
      Date.now(),
    ]);
  }
};
