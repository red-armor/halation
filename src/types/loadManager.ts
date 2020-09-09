import { Strategy } from './loadStrategy';
import LoadManager from '../LoadManager';

export interface LoadManagerConstructor {
  new (moduleKey: string, strategies: Array<Strategy>): LoadManager;
}
