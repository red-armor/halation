export * from './halation';
export * from './blockNode';
export * from './module';
export * from './node';
export * from './loadStrategy';

declare global {
  interface ProxyConstructorSE {
    new <T extends object>(target: T, handler: ProxyHandler<T>): T;
  }
}
