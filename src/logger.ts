export const warn = (...args: Array<any>) => {
  console.warn.call(null, ...args);
};

export const log = (...args: Array<any>) => {
  console.log.call(null, ...args);
};

export const error = (props: { name: string; message: string }) => {
  const { message, name } = props;
  console.error(message, name);
};
