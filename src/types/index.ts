export * from './halation';
export * from './blockNode';
export * from './module';
export * from './node';
export * from './loadStrategy';
export * from './tracker';
export * from './eventTracker';
export * from './effectNode';

declare global {
  interface ProxyConstructorSE {
    new <T extends object>(target: T, handler: ProxyHandler<T>): T;
  }
}
