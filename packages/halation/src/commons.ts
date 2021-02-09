const toString = Function.call.bind<Function>(Object.prototype.toString);
export const isFunction = (fn: any): boolean => typeof fn === 'function';
export const isString = (o: any) => toString(o) === '[object String]';
export const isPlainObject = (o: any) => toString(o) === '[object Object]';
export const isPromise = (o: any) =>
  typeof o === 'object' && typeof o.then === 'function';
export const isPresent = (o: any) => toString(o) !== '[object Undefined]';

export const reflect = (p: Promise<any>) =>
  p.then(
    (value) => {
      return { value, success: true };
    },
    (value) => {
      return { value, success: false };
    }
  );

export const settledPromise = (ps: Array<Promise<any>>) =>
  Promise.all(ps.map((p) => reflect(p)));

export const canIUseProxy = () => {
  try {
    new Proxy({}, {}) // eslint-disable-line
  } catch (err) {
    return false;
  }

  return true;
};

export const createHiddenProperty = (
  target: object,
  prop: PropertyKey,
  value: any
) => {
  Object.defineProperty(target, prop, {
    value,
    enumerable: false,
    writable: true,
  });
};

export const hasSymbol = typeof Symbol !== 'undefined';
export const TRACKER: unique symbol = hasSymbol
  ? Symbol('tracker')
  : ('__tracker__' as any);

export const isTrackable = (o: any) => { // eslint-disable-line
  return ['[object Object]', '[object Array]'].indexOf(toString(o)) !== -1;
};

export const noop = () => {};
