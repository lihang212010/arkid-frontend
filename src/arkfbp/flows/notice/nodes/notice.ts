import { APINode } from '@/arkfbp/nodes/apiNode'

export class NoticeNode extends APINode {
  async run() {
    const { url, method, request, client } = this.inputs
    this.url = url
    this.method = method
    this.params = request
    const outputs = await super.run()
    if (outputs && outputs.results) {
      client.state.items = outputs.results
      client.total = outputs.count
    }
  }
}