import { RecordBaseProps, RenderBlockBlockProps } from '../types'

class RecordBase {
  private _name: string;
  private _key: string;
  private _children?: Array<RecordBase>
  private _props: object;
  private _extraProps: object
  private _blockProps: RenderBlockBlockProps;

  constructor(recordProps: RecordBaseProps) {
    const {
      name,
      key,
      children,
      props,
      extraProps
    } = recordProps

    this._name = name
    this._key = key
    this._children = children
    this._props = props || {}
    this._extraProps = extraProps || {}

    this._blockProps = {
      key: this._key,
      name: this._name,
      props: this._props,
    };
  }

  getName() {
    return this._name
  }

  getKey() {
    return this._key
  }

  getChildren() {
    return this._children
  }

  getProps() {
    return this._props
  }

  getExtraProps() {
    return this._extraProps
  }

  getRenderProps(): RenderBlockBlockProps {
    return this._blockProps;
  }
}

export default RecordBase