const errors: {
  [key: number]: Function | string;
} = {
  10001: (err: Error) => {
    return `fail to build halation state from array \n\n ${err.message}`;
  },
};

const error = (code: number, ...args: Array<any>) => {
  const e = errors[code];
  const message = typeof e === 'function' ? e.apply(null, args) : e;
  const err = new Error(`[HalationCore] ${message}`);

  if (args[0] instanceof Error) {
    err.name = args[0].name;
  }
  throw err;
};

export default error;
