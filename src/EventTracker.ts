import { EventValue, HalationEvents, ProxyEvent } from './types';
import LoadManager from './LoadManager';
import Tracker from './Tracker';
import { generateRemarkablePaths } from './path';
import EffectNode from './EffectNode';
import { logActivity } from './logger';

class EventTracker {
  public events: HalationEvents;
  private eventObject: ProxyEvent;
  private _proxyEvent: ProxyEvent;
  private currentLoadManager: LoadManager | null;
  private accessPaths: Array<Array<string>>;
  private effectNodeTree: EffectNode;

  constructor(props: { events: HalationEvents }) {
    const { events } = props;
    this.events = events;
    this.eventObject = this.initEventObject();
    this._proxyEvent = new Tracker({
      path: [],
      base: this.eventObject,
      reportAccessPaths: this.reportAccessPaths.bind(this),
    });

    this.accessPaths = [];
    this.effectNodeTree = new EffectNode({
      key: 'root',
    });

    this.currentLoadManager = null;
  }

  /**
   *
   * @param eventValue
   * 目前先做到第一层的比较
   */
  updateEventValue(eventValue: EventValue) {
    const { event, value } = eventValue;
    const baseEventValue = this._proxyEvent[event];
    if (baseEventValue !== value) {
      this._proxyEvent[event] = value;
      this.effectNodeTree.triggerEffect([event]);
    }
  }

  getProxyEvent() {
    return this._proxyEvent;
  }

  reportAccessPaths(paths: Array<string>) {
    this.accessPaths.push(paths);
  }

  initEventObject(): {} {
    return this.events.reduce((acc, cur) => {
      return { ...acc, [cur]: {} };
    }, {});
  }

  setLoadManager(loadManager: LoadManager) {
    this.accessPaths = [];
    this.currentLoadManager = loadManager;
  }

  releaseLoadManager() {
    const tipPoints = generateRemarkablePaths(this.accessPaths);
    if (this.currentLoadManager) {
      this.effectNodeTree.addChildren({
        paths: tipPoints,
        loadManager: this.currentLoadManager,
      });
    }

    logActivity('EventTracker', {
      message: `add effects to loadManager ${this.currentLoadManager?.getKey()}`,
    });

    this.currentLoadManager = null;
  }

  addEffect() {}
}

export default EventTracker;
