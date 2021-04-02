import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import getUrl from '@/utils/get-url'

export class GetDialogValues extends TokenAPINode {
  async run() {
    const data = this.inputs.com.state.data
    if (!data) {
      throw Error('dialogs is not data')
    }
    this.url = getUrl(this.inputs.params.updateUrl, data)
    this.method = 'get'
    const outputs = await super.run()
    return {
      outputs: outputs,
      com: this.inputs.com,
      params: this.inputs.params,
    }
  }
}