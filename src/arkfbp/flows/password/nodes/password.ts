import { Update } from '@/arkfbp/flows/update/nodes/update'
import { TenantModule } from '@/store/modules/tenant'
import { UserModule } from '@/store/modules/user'

export class Password extends Update {
  async run() {
    const { url, method, com, data } = this.inputs
    const submitData = com.formData
    const uuid = data?.uuid || UserModule.uuid
    const params = {
      old_password: submitData.oldPassword,
      password: submitData.password,
      uuid: uuid,
      tenant_uuid: TenantModule.currentTenant.uuid
    }
    this.inputs.url = url
    this.inputs.method = method
    this.inputs.params = params
    await super.run()
  }
}
