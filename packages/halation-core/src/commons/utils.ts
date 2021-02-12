const toString = Function.call.bind<Function>(Object.prototype.toString);
export const isFunction = (fn: any): boolean => typeof fn === 'function';
export const isString = (o: any) => toString(o) === '[object String]';
export const isPlainObject = (o: any) => toString(o) === '[object Object]';
export const isPromise = (o: any) =>
  typeof o === 'object' && typeof o.then === 'function';
export const isPresent = (o: any) => toString(o) !== '[object Undefined]';

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