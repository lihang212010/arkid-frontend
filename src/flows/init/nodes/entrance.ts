import { APINode } from '@/arkfbp/nodes/apiNode'
import { ConfigModule } from '@/store/modules/config'
import isIp from 'is-ip'

export class Entrance extends APINode {
  async run() {
    // get frontend url - for support slug
    this.url = '/api/v1/get_frontendurl/'
    this.method = 'get'
    const outputs = await super.run()
    const url = outputs?.url
    if (url) ConfigModule.setOrigin(url)
  }
}