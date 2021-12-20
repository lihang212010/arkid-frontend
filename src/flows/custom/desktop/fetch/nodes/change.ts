import { APINode } from '@/arkfbp/nodes/apiNode'
import { UserModule } from '@/store/modules/user'

export class ChangeStateNode extends APINode {

  async run() {
    const { results, source } = this.inputs
    if (!results) return
    const client = source.client
    const { buttons, card, groups } = client
    const { app_manage, application_group, multiple_account_edit, results: res } = results

    if (!app_manage) {
      card.buttons = []
    }

    if (!multiple_account_edit) {
      buttons.splice(0, buttons.length)
    }

    // set app position
    // this.url = '/api/v1/user/appdata/'
    // this.method = 'GET'
    // const res = await super.run()
    // const data = res.data || []

    // save for headers search function
    const desktopApps = new Array()

    if (res && res.length > 0) {
      
      groups.splice(0, groups.length)

      if (application_group) {
        for (let i = 0, l = res.length; i < l; i++) {
          const { apps, group_name } = res[i]
          if (apps?.length === 0) continue
          const items = apps.map(app => {
            desktopApps.push(app)
            return {
              type: 'CardPanel',
              state: {
                ...app,
                buttons: multiple_account_edit ? buttons.map(btn => {
                  return { ...btn, data: app }
                }) : []
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
        const items = new Array()
        for (let i = 0, l = res.length; i < l; i++) {
          items.push({
            type: 'CardPanel',
            state: {
              ...res[i],
              buttons: multiple_account_edit ? buttons.map(btn => {
                return { ...btn, data: res[i] }
              }) : []
            }
          })
        }
        groups.push({
          name: '',
          title: undefined,
          items
        })
      }
    }
    
    UserModule.setUserApps(desktopApps)
  }
}
