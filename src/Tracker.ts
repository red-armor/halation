import { createHiddenProperty, isTrackable, TRACKER } from './commons';
import { ProxyEvent, TrackerConstructor } from './types';

const Tracker = (function({ base }: { base: ProxyEvent }) {
  let tracker = base;

  if (isTrackable(base)) {
    // base should be destructed, or
    tracker = new Proxy(
      { ...base },
      {
        get: (target, prop, receiver) => {
          if (prop === TRACKER) return Reflect.get(target, prop, receiver);
          const tracker = Reflect.get(target, TRACKER, receiver);
          const value = tracker.base[prop];
          const childrenProxies = tracker['childrenProxies'];
          if (isTrackable(value)) {
            if (!childrenProxies[prop]) {
              childrenProxies[prop] = new Tracker({ base: value });
            } else if (childrenProxies[prop].base !== value) {
              childrenProxies[prop] = new Tracker({ base: value });
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
