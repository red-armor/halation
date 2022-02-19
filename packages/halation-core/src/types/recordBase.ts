import RecordBase from '../data/RecordBase';

export type RecordBaseProps = {
  name: string;
  key?: string;
  id?: string;
  props?: object;
  extraProps?: object;
  children?: Array<RecordBase>;
};

export type CreateFromLiteArrayProps = {
  name: string;
  key: string;
  props?: object;
  extraProps?: object;
  children?: Array<CreateFromLiteArrayProps>;
};

export type CreateFromArrayProps = {
  name: string;
  key: string;
  props?: object;
  extraProps?: object;
  children?: Array<CreateFromArrayProps>;
};
