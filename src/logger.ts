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
