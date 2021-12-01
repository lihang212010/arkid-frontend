import { APINode } from '@/arkfbp/nodes/apiNode'

export class AppManageNode extends APINode {
  async run() {
    const { client, url, method, clientServer, com } = this.inputs
    const { name, title } = clientServer
    this.url = url
    this.method = method
    const outputs = await super.run()
    const data = outputs && outputs.data
    if (data && data.length > 0) {
      const groups = client.groups
      let index = -1
      for (let i = 0, len = groups.length; i < len; i++) {
        if (groups[i].name === name) {
          index = i
          break
        }
      }
      if (index !== -1) {
        groups.splice(index, 1)
      }
      const items = {}
      data.forEach((app, index) => {
        items[`app${index}`] = {
          label: app.name,
          type: 'SwitchForm',
          prop: `app${index}`,
          state: {
            value: app.value || false,
            uuid: app.id || app.uuid,
            action: name,
            data: app
          }
        }
      })
      groups.push({
        name,
        title,
        items
      })
    }
  }
}
