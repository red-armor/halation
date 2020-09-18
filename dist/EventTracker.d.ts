import { EventValue, HalationEvents, ProxyEvent } from './types';
import LoadManager from './LoadManager';
declare class EventTracker {
    events: HalationEvents;
    private eventObject;
    private _proxyEvent;
    private currentLoadManager;
    private accessPaths;
    private effectNodeTree;
    constructor(props: {
        events: HalationEvents;
    });
    /**
     *
     * @param eventValue
     * 目前先做到第一层的比较
     */
    updateEventValue(eventValue: EventValue): void;
    getProxyEvent(): ProxyEvent;
    reportAccessPaths(paths: Array<string>): void;
    initEventObject(): {};
    setLoadManager(loadManager: LoadManager): void;
    releaseLoadManager(): void;
    addEffect(): void;
}
export default EventTracker;
