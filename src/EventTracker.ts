import { HalationEvents, ProxyEvent } from './types';
import LoadManager from './LoadManager';

class EventTracker {
  public events: HalationEvents;
  private eventObject: ProxyEvent;
  private _proxyEvent: ProxyEvent;
  private currentLoadManager: LoadManager | null;

  constructor(props: { events: HalationEvents }) {
    const { events } = props;
    this.events = events;
    this.eventObject = this.initEventObject();

    this._proxyEvent = new Proxy(this.eventObject, {
      get: (target, prop) => {
        console.log('listen ', prop, this.currentLoadManager?.key);
        return Reflect.get(target, prop);
      },
      set: (target, prop, newValue, receiver) => {
        return Reflect.set(target, prop, newValue, receiver);
      },
    });

    this.currentLoadManager = null;
  }

  getProxyEvent() {
    return this._proxyEvent;
  }

  initEventObject(): {} {
    return this.events.reduce((acc, cur) => {
      return { ...acc, [cur]: false };
    }, {});
  }

  setLoadManager(loadManager: LoadManager) {
    this.currentLoadManager = loadManager;
  }

  releaseLoadManager() {
    this.currentLoadManager = null;
  }
}

export default EventTracker;
