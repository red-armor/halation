import { createHiddenProperty, isTrackable, TRACKER } from './commons';
import { TrackerConstructor, TrackerConstructorProps } from './types';

const Tracker = (function({
  base,
  path = [],
  reportAccessPaths,
}: TrackerConstructorProps) {
  let tracker = base;

  if (isTrackable(base)) {
    // base should be destructed, or will be the same object.
    tracker = new Proxy(
      { ...base },
      {
        get: (target, prop, receiver) => {
          if (prop === TRACKER) return Reflect.get(target, prop, receiver);
          // Take note: Reflect.get will not trigger `get` handler
          const tracker = Reflect.get(target, TRACKER, receiver);
          const base = tracker.base;
          // if key is 'base', should not report and return directly.
          if (prop === 'base') return base;
          const value = base[prop];
          const childrenProxies = tracker['childrenProxies'];
          const nextPath = path.concat(prop as string);

          reportAccessPaths(nextPath);

          if (isTrackable(value)) {
            if (!childrenProxies[prop]) {
              childrenProxies[prop] = new Tracker({
                base: value,
                path: nextPath,
                reportAccessPaths,
              });
            } else if (childrenProxies[prop].base !== value) {
              childrenProxies[prop] = new Tracker({
                base: value,
                path: nextPath,
                reportAccessPaths,
              });
            }
            return childrenProxies[prop];
          } else if (childrenProxies[prop]) {
            delete childrenProxies[prop];
          }

          return value;
        },
        set: (target, prop, newValue, receiver) => {
          return Reflect.set(target, prop, newValue, receiver);
        },
      }
    );

    createHiddenProperty(tracker, TRACKER, {
      base,
      childrenProxies: {},
      effects: [],
      paths: [],
    });
  }

  return tracker;
} as any) as TrackerConstructor;

export default Tracker;
