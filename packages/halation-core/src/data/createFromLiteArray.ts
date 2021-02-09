import { CreateFromLiteArrayProps } from "../types"
import { generateRandomKey } from '../commons/key'
import RecordBase from './RecordBase'

const createFromLiteArray = (data: CreateFromLiteArrayProps) => {
  if (Array.isArray(data)) {
    try {
      return data.map(props => {
        const key = generateRandomKey()
        const { children } = props
        let nextChildren = children
        if (Array.isArray(nextChildren) && nextChildren.length) {
          nextChildren = createFromLiteArray(children)
        }
        const item = new RecordBase({
          ...props,
          children: nextChildren,
          key,
        })
        return item
      })
    } catch(err) {
      console.error('')
    }
  }

  return []
}

export default createFromLiteArray