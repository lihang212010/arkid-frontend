import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/get-url'
import getDialogParams from '@/utils/get-dialog-params'
import TreePageState from '@/admin/TreePage/TreePageState'
import FormPageState from '@/admin/FormPage/FormPageState'

export class AddTreeNode extends TokenAPINode {
  async run() {
    const tempState: TreePageState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState

    const url = getUrl(this.inputs.params.createUrl)
    const method = this.inputs.params.createMethod
    if (!url) {
      throw Error('addTreeNode flow is not url')
    }
    this.url = url
    this.method = method || 'post'
    
   
    if (tempState && tempState.dialogs) {
      const formPage = tempState.dialogs['addTreeNode'].state as FormPageState
      this.params = getDialogParams(formPage)
    } else {
      throw Error('addTreeNode is not params, please check')
    }

    const outputs = await super.run()
    tempState.dialogs['addTreeNode'].visible = false
    await runFlowByFile('flows/treePage/fetchTreeNode', this.inputs)
    return outputs
  }
}