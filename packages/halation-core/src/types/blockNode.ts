import { FC } from 'react';
import { BlockNodeBaseProps, RenderBlock, ComponentPropsAPI } from './halation';
import RecordBase from '../data/RecordBase'
export interface BlockNodeData {
  [key: string]: any;
}
export interface RenderBlockBlockProps {
  key: string;
  name: string;
  type?: string;
  props?: object;
}

export type BlockNodePreProps<RBP extends RenderBlockBaseComponentProps> = BlockNodeBaseProps<RBP> & {
  block: RecordBase;
  renderBlock?: RenderBlock<RBP>;
};

export type RenderBlockBaseComponentProps = {
  blockProps: RenderBlockBlockProps;
  block: RecordBase;
  // children: FC<ForwardBlockComponentProps>;

  // https://stackoverflow.com/a/42261933, children should be marked with ReactElement.
  // React.cloneElement will report with ts error.
  // ````
  //  Argument of type 'ReactNode' is not assignable to parameter of type
  // 'ReactElement<any, string | ((props: any) => ReactElement<any, any>)
  // | (new (props: any) => Component<any, any, any>)>'

  children: React.ReactElement,
  extraProps: {
    [key: string]: any
  },
}

export type BlockComponentProps = ComponentPropsAPI & {
  block: RecordBase;
  props: {
    [key: string]: any
  };
};

export type ForwardBlockComponentProps = BlockComponentProps & {
  forwardRef: any
}

export interface BlockWrapperState {
  Component?: null | FC<any>;
}
