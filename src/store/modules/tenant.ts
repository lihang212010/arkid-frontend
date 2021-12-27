import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export interface ITenantState {
  tenantState: AdminComponentState
  currentTenant: ITenant
  isPlatformTenant: boolean
  isUseSlug: boolean
}

export interface ITenant {
  uuid?: string
  name?: string
  slug?: string
  icon?: string
  created?: string
}

@Module({ dynamic: true, store, name: 'tenant' })
class Tenant extends VuexModule implements ITenantState {
  tenantState: AdminComponentState = {}
  currentTenant: ITenant = {}
  tenantSwitch: boolean = true
  isPlatformTenant: boolean = true
  isUseSlug: boolean = true

  @Mutation
  public changeState(payload: any) {
    this.tenantState = payload
  }

  @Mutation
  public changeCurrentTenant(payload: any) {
    this.currentTenant = payload
  }

  @Mutation
  public setTenantSwitch(value: boolean) {
    this.tenantSwitch = value
  }

  @Mutation
  public setTenantIsPlatform(value: boolean) {
    this.isPlatformTenant = value;
  }

  @Mutation
  public setTenantUUID(uuid: string) {
    this.currentTenant.uuid = uuid
  }

  @Mutation
  public setTenantSlug(slug: string) {
    this.currentTenant.slug = slug
  }

  @Mutation
  public setIsUseSlug(value: boolean) {
    this.isUseSlug = value
  }
}

export const TenantModule = getModule(Tenant)
