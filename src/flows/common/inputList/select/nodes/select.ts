import { FunctionNode } from 'arkfbp/lib/functionNode'
import { processUUId } from '@/utils/common'

export class SelectNode extends FunctionNode {
  async run() {
    const { client: state, params } = this.inputs
    const { multiple, field } = params
    const { items, data } = state.list
    const dep = state.table ? state.table.row : state.tree ? state.tree.node : null
    if (!dep || !dep[field]) return
    const item = {
      label: dep.label || dep.name || dep.username || '',
      value: dep[field]
    }
    if (items.length === 0) {
      items.push(item)
      data.push(item.value)
    } else if (multiple) {
      let isExistThisValue = false
      for (let i = 0, len = items.length; i < len; i++) {
        const item = items[i]
        if (processUUId(item.value) === processUUId(dep[field])) {
          items.splice(i, 1)
          data.splice(i, 1)
          isExistThisValue = true
          break
        }
      }
      if (!isExistThisValue) {
        items.push(item)
        data.push(item.value)
      }
    } else {
      items[0] = item
      data[0] = item.value
    }
  }
}