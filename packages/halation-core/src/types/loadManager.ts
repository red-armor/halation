import LoadManager from '../LoadManagerBase';
import { ModuleMap } from './halation';

export interface LoadManagerConstructor {
  new (moduleKey: string): LoadManager;
}

export interface LoadManagerConstructorProps {
  blockKey: string;
  moduleName: string;
  moduleMap: ModuleMap;
}

export enum RESOLVER_TYPE {
  'PENDING',
  'RESOLVED',
}
