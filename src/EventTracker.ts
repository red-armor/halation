import { HalationEvents, ProxyEvent } from './types';
import LoadManager from './LoadManager';
import Tracker from './Tracker';

class EventTracker {
  public events: HalationEvents;
  private eventObject: ProxyEvent;
  private _proxyEvent: ProxyEvent;
  private currentLoadManager: LoadManager | null;

  constructor(props: { events: HalationEvents }) {
    const { events } = props;
    this.events = events;
    this.eventObject = this.initEventObject();
    this._proxyEvent = new Tracker({
      base: this.eventObject,
    });

    this.currentLoadManager = null;
  }

  getProxyEvent() {
    return this._proxyEvent;
  }

  initEventObject(): {} {
    return this.events.reduce((acc, cur) => {
      return { ...acc, [cur]: {} };
    }, {});
  }

  setLoadManager(loadManager: LoadManager) {
    this.currentLoadManager = loadManager;
  }

  releaseLoadManager() {
    this.currentLoadManager = null;
  }

  addEffect() {}
}

export default EventTracker;
