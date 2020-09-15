import { ProxyEvent } from './halation';
import { ReportAccessPaths } from './eventTracker';

export interface TrackerConstructor {
  new ({ base, path, reportAccessPaths }: TrackerConstructorProps): {};
}

export interface TrackerConstructorProps {
  base: ProxyEvent;
  path: string[];
  reportAccessPaths: ReportAccessPaths;
}
