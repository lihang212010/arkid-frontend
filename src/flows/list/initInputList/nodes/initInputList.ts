import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export class InitInputList extends FunctionNode {
  async run() {
    const { client: state, com } = this.inputs
    const currentPage = com.state.page
    await runFlowByFile('flows/initPage', {
      currentPage
    }).then((res) => {
      this.initInputListDialog(res, com)
      res.state.list = state.dialogs!.inputList.state.state.list
      state.dialogs!.inputList.state = res
      state.dialogs.inputList.visible = true
    })
  }
  
  initInputListDialog(pageState: AdminComponentState, com: any) {
    const path = com.path
    const { multiple, field } = com.state
    const { state, type } = pageState
    state.actions.confirm = [
      {
        name: 'flows/list/confirm',
        path: path,
        request: {
          multiple,
          field
        }
      }
    ]
    state.actions.clicked = [
      {
        name: 'flows/list/clicked',
        request: {
          multiple,
          type,
          field
        }
      }
    ]
    switch (type) {
      case 'TablePage':
        state.table.selection = {
          exist: multiple,
          values: []
        }
        state.table.selectAction = 'clicked'
        break
      case 'TreePage':
        state.tree.action = 'clicked'
    }
  }
}