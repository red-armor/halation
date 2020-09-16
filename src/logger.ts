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

export const logActivity = (
  moduleName: string,
  { message, value }: { message: string; value?: any }
) => {
  const title: string = `[${moduleName}]`;
  const titleStyle = 'color: #7cb305; font-weight: bold';
  const messageStyle = 'color: #ff4d4f; font-weight: bold';
  console.log.apply(null, [
    '%c' + title + ' %c' + message,
    titleStyle,
    messageStyle,
    value ? value : '',
    Date.now(),
  ]);
};
