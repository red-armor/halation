import { ProxyEvent } from './halation';

export interface TrackerConstructor {
  new ({ base }: TrackerConstructorProps): {};
}

export interface TrackerConstructorProps {
  base: ProxyEvent;
}
