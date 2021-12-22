import { FunctionNode } from 'arkfbp/lib/functionNode'
import { AppModule } from '@/store/modules/app'

export class ChangePageStateNode extends FunctionNode {

  async run() {
    const { state, page } = this.inputs
    if (!AppModule.isBind) {
      state.$tabs.value = page
      AppModule.SetAppBindStatus(true)
      const { uuid, name } = AppModule.curApp
      if ( uuid && name ) {
        const fetchAction = state[page]?.state.actions?.fetch
        if (fetchAction) {
          fetchAction.push('openCreateDialog', `${page}.create.auto`)
        }
      }
    }
  }

}