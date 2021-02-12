class AutoRunFn {
  private autoRun: Function;
  private refTracker: RefTracker;
  private deps: Array<TrackerNode>;
  private removers: Array<Function>;

  constructor({ fn, refTracker }: { fn: Function; refTracker: RefTracker }) {
    this.autoRun = fn;
    this.refTracker = refTracker;
    this.deps = [];
    this.removers = [];
    this.trigger();
  }

  trigger() {
    this.refTracker.enter(this);
    this.autoRun.call(null);
    this.refTracker.leave();
  }

  addDeps(trackerNode: TrackerNode) {
    if (trackerNode && !this.deps.includes(trackerNode)) {
      this.deps.push(trackerNode);
      trackerNode.addEffect(this);
      this.removers.push(() => {
        if (trackerNode) {
          trackerNode.removeEffect(this);
        }
      });
    }
  }

  teardown() {
    this.removers.forEach(remover => remover());
    this.removers = [];
    this.deps = [];
  }
}

class TrackerNode {
  private effects: Array<AutoRunFn>;
  private value: any;

  constructor(options?: { value: any }) {
    const { value } = options || {};
    this.effects = [];
    this.value = value || null;
  }

  addEffect(autoRunFn: AutoRunFn) {
    this.effects.push(autoRunFn);
  }

  removeEffect(autoRunFn: AutoRunFn) {
    const index = this.effects.findIndex(item => item === autoRunFn);
    this.effects.splice(index, 1);
  }

  setValue(newValue: any) {
    if (newValue !== this.value) {
      this.value = newValue;

      this.effects.forEach(effect => {
        effect.teardown();
        effect.trigger();
      });
    }
  }

  getValue() {
    return this.value;
  }
}

class RefTracker {
  public autoRunMap: WeakMap<Function, AutoRunFn>;
  public queue: Array<AutoRunFn>;
  public TrackerNodeMap: Map<string, TrackerNode>;

  constructor() {
    this.autoRunMap = new WeakMap<Function, AutoRunFn>();
    this.TrackerNodeMap = new Map<string, TrackerNode>();
    this.queue = [];
    this.watch = this.watch.bind(this);
  }

  setRef(name: string, value: any) {
    // setRef调用的时候，有可能说组件从来没有被调用过`getRef`方法；
    // 所以，这里先进行创建
    if (!this.TrackerNodeMap.has(name)) {
      this.TrackerNodeMap.set(name, new TrackerNode());
    }
    const trackerNode = this.TrackerNodeMap.get(name);
    trackerNode!.setValue(value);
  }

  getRef(name: string) {
    if (!this.TrackerNodeMap.has(name)) {
      this.TrackerNodeMap.set(name, new TrackerNode());
    }

    const trackerNode = this.TrackerNodeMap.get(name);
    const currentAutoRunFn = this.getCurrentAutoRunFn();
    currentAutoRunFn.addDeps(trackerNode!);
    return trackerNode!.getValue();
  }

  watch(fn: Function) {
    const autoRunFn = new AutoRunFn({
      fn,
      refTracker: this,
    });
    this.autoRunMap.set(fn, autoRunFn);

    return () => {
      autoRunFn.teardown();
      this.autoRunMap.delete(fn);
    };
  }

  enter(autoRunFn: AutoRunFn) {
    this.queue.push(autoRunFn);
  }

  leave() {
    this.queue.pop();
  }

  getCurrentAutoRunFn(): AutoRunFn {
    const length = this.queue.length;
    return this.queue[length - 1];
  }
}

export default RefTracker;
