import { createHiddenProperty, isTrackable, TRACKER } from './commons';

function Tracker(base: object) {
  let tracker = base;

  if (isTrackable(base)) {
    tracker = new Proxy(base, {
      get: (target, prop) => {
        return Reflect.get(target, prop);
      },
      set: (target, prop, newValue, receiver) => {
        return Reflect.set(target, prop, newValue, receiver);
      },
    });

    createHiddenProperty(tracker, TRACKER, {
      base,
    });
  }

  return tracker;
}

export default Tracker;
