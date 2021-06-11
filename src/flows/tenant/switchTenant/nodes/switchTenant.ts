import { Jump } from '@/arkfbp/flows/jump/nodes/jump'
import { TenantModule } from '@/store/modules/tenant'
import { TablePage } from '@/admin/TablePage/TablePageState'
import { getOriginUrl } from '@/utils/cookies'
import { getToken } from '@/utils/auth'

export class SwitchTenant extends Jump {
  async run() {
    const tenantState: TablePage = this.inputs.client
    const data: any = tenantState.dialogs?.switch.data
    TenantModule.changeCurrentTenant(data)
    let target
    const slug = data.slug
    if (slug) {
      TenantModule.setHasSlug(true)
      const host = getOriginUrl()
      const newHost = host?.replace(window.location.protocol + '//', window.location.protocol + '//' + slug + '.')
      const url = newHost + '/' + process.env.VUE_APP_BASE_API + '?token=' + getToken()
      window.location.replace(url)
    } else {
      target = {
        path: '/',
        query: {
          tenant: TenantModule.currentTenant.uuid
        }
      }
    }
    this.inputs.target = target
    await super.run()
  }
}