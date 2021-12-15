import { APINode } from "@/arkfbp/nodes/apiNode"
import { TenantModule } from '@/store/modules/tenant'
import { getSlug, getUrlParamByName } from '@/utils/url'
import getBaseUrl from '@/utils/get-base-url'
import { processUUId } from '@/utils/common'
import { ConfigModule } from '@/store/modules/config'

export class TenantNode extends APINode {
  async run() {
    let uuid = '', tenantSwitch = true, currentTenantUUID = ''

    // platform uuid and tenant switch info
    this.url = '/api/v1/tenant_switchinfo/'
    this.method = 'GET'
    const outputs = await super.run()
    uuid = outputs?.platform_tenant_uuid
    tenantSwitch = outputs?.switch
    TenantModule.setTenantSwitch(tenantSwitch)
    const slug = getSlug()
    if (slug === '') {
      currentTenantUUID = getUrlParamByName('tenant') || getUrlParamByName('tenant_uuid') || uuid
      currentTenantUUID = processUUId(currentTenantUUID) as string
      this.url = `/api/v1/tenant/${currentTenantUUID}/`
      this.method = 'GET'
      const outputs = await super.run()
      if (outputs?.uuid) {
        TenantModule.changeCurrentTenant(outputs)
      } else {
        TenantModule.changeCurrentTenant({ uuid: currentTenantUUID })
      }
    } else {
      if (tenantSwitch === false) {
        this.toPlatform()
      } else {
        this.url = `/api/v1/tenant/${slug}/slug/`
        this.method = 'GET'
        const res = await super.run()
        if (res.uuid) {
          ConfigModule.setSlug(slug)
          TenantModule.changeCurrentTenant(res)
        } else {
          this.toPlatform()
        }
      }
    }
  }

  toPlatform() {
    const origin = ConfigModule.origin
    window.location.href = `${origin}/${getBaseUrl()}`
  }
}
