import { FunctionNode } from 'arkfbp/lib/functionNode'

export class InitInputList extends FunctionNode {
  async run() {
    // input list base info
    const { client: state, com } = this.inputs
    const { page, multiple, field, parent, value, options } = com.state
    const pageState = com.getAnyPageState(page)
    const type = pageState.tree ? 'TreePage' : 'TablePage'

    // list data
    if (!pageState.list) {
      pageState.list = {
        title: '已选数据列表',
        buttons: [
          {
            label: '确认所选',
            type: 'primary',
            action: 'confirm',
            size: 'mini'
          }
        ],
        items: [],
        isActive: true,
        disabled: true,
        clearable: true,
        data: [],
        clearAction: 'fetch'
      }
    }

    // add action
    const actions = pageState.actions
    const fetchAction = actions.fetch[0]
    // filter data
    if (fetchAction) {
      fetchAction.request.excludes = 'list.data'
    }
    actions.confirm = [
      {
        name: 'flows/common/inputList/confirm',
        path: com.path,
        request: {
          multiple,
          field
        }
      },
      `${parent}.close${page}`
    ]
    actions.select = [
      {
        name: 'flows/common/inputList/select',
        request: {
          multiple,
          field
        }
      },
      'fetch'
    ]
    const { items, data } = pageState.list
    // set list inital data
    items.length = 0
    for (let item of options) {
      items.push(item)
      data.push(item.value)
    }
    // set table or tree default data and execute action
    // can process multiple => extend content ...
    switch(type) {
      case 'TablePage':
        pageState.table.rowClickAction = 'select'
        break
      case 'TreePage':
        pageState.tree.nodeClickAction = 'select'
    }
    // open dialog => inputList page
    state.dialogs[page].visible = true
  }
}