import { APINode } from '@/arkfbp/nodes/apiNode'
import { UserModule } from '@/store/modules/user'

export class ChangeStateNode extends APINode {

  async run() {
    const { results, source } = this.inputs
    if (!results) return
    const { client, clientServer } = source
    const { name, title } = clientServer || {}
    const buttons = client.buttons

    // set app position
    // this.url = '/api/v1/user/appdata/'
    // this.method = 'GET'
    // const res = await super.run()
    // const data = res.data || []

    // save for headers search function
    UserModule.setUserApps(results || [])

    const groups = client.groups
    for (const group of groups) {
      const flag = groups.length === 1 || group.name === name
      if (flag) {
        group.items = []
        if (results.length === 0) {
          group.title = ''
        } else {
          results.forEach((item) => {
            group.items.push({
              type: 'CardPanel',
              state: {
                ...item,
                buttons: buttons.length ? buttons.map(btn => { return { ...btn, data: item } }) : []
              }
            })
          })
          group.title = title
        }
      }
      if (groups.length === 1) group.title = ''
    }
    

    // set desktop apps panel -- cardpanel
    // if (results && results.length) {
    //   const firstArr = new Array()
    //   const secondArr = new Array()
    //   results.forEach(app => {
    //     const uuid = app.uuid
    //     const index = data.indexOf(uuid)
    //     if (index !== -1) {
    //       firstArr[index] = {
    //         type: 'CardPanel',
    //         state: app
    //       }
    //     } else {
    //       secondArr.push({
    //         type: 'CardPanel',
    //         state: app
    //       })
    //     }
    //   })
    //   client.items = firstArr.concat(secondArr)
    // }
  }
}
