import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangePageStateNode extends FunctionNode {

  async run() {
    const { state, page } = this.inputs
    const actions = state[page].state.actions
    if (actions) {
      actions.auto = [
        {
          name: 'flows/custom/user/account/auto'
        }
      ]
    }
  }

}