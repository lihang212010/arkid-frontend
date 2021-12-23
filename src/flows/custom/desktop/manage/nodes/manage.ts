import { APINode } from '@/arkfbp/nodes/apiNode'

export class AppManageNode extends APINode {
  async run() {
    const { client, url, method, clientServer } = this.inputs
    this.url = url
    this.method = method
    const outputs = await super.run()
    if (!outputs) return
    const { application_group, data } = outputs
    if (!data?.length) return
    const { groups } = client
    const { name } = clientServer
    groups.splice(0, groups.length)
    if (application_group) {
      for (let i = 0, l = data.length; i < l; i++) {
        const items = {}
        const { group_name, apps } = data[i]
        if (apps?.length === 0) continue
        apps.forEach((app, index) => {
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
          name: i,
          title: group_name,
          items
        })
      }
    } else {
      const items = {}
      for (let i = 0, l = data.length; i < l; i++) {
        const item = data[i]
        items[`app${i}`] = {
          label: item.name,
          type: 'SwitchForm',
          prop: `app${i}`,
          state: {
            value: item.value || false,
            uuid: item.id || item.uuid,
            action: name,
            data: item
          }
        }
      }
      groups.push({
        name: '',
        title: undefined,
        items
      })
    }
  }
}
