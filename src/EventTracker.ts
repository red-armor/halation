import produce, { StateTrackerUtil } from 'state-tracker';
import { EventValue, HalationEvents, ProxyEvent } from './types';
import LoadManager from './LoadManager';
import EffectNode from './EffectNode';
import { logActivity } from './logger';

class EventTracker {
  public events: HalationEvents;
  private _proxyEvent: ProxyEvent;
  private currentLoadManager: LoadManager | null;
  private effectNodeTree: EffectNode;

  constructor(props: { events: HalationEvents }) {
    const { events } = props;
    this.events = events;
    this._proxyEvent = produce(this.events);

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

  setLoadManager(loadManager: LoadManager) {
    this.currentLoadManager = loadManager;
  }

  releaseLoadManager() {
    const tracker = StateTrackerUtil.getContext(
      this._proxyEvent as any
    ).getCurrent();
    const tipPoints = tracker.getRemarkable();
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
