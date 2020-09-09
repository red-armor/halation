export const isFunction = (fn: any): boolean => typeof fn === 'function';
export const noop = () => {};

export const reflect = (p: Promise<any>) =>
  p.then(
    value => {
      return { value, success: true };
    },
    value => {
      return { value, success: false };
    }
  );

export const settledPromise = (ps: Array<Promise<any>>) =>
  Promise.all(ps.map(p => reflect(p)));
