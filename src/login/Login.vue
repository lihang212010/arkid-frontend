<template>
  <div class="login">
    <LoginHeader
      :icon="tenant.icon"
      :name="tenant.name"
    />
    <LoginSlug v-if="isEnterSlug" />
    <LoginContainer
      v-else-if="isRender"
      :config="config"
      :complexity="tenant.complexity"
    />
    <LoginFooter />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import LoginHeader from './components/Header.vue'
import LoginContainer from './components/Container.vue'
import LoginSlug from './components/Slug.vue'
import LoginFooter from './components/Footer.vue'
import { LoginPagesConfig, LoginTenant, ButtonConfig } from './interface'
import LoginStore from './store/login'
import getBaseUrl from '@/utils/get-base-url'
import http from './http'
import { getLoginPage } from './login'

@Component({
  name: 'Login',
  components: {
    LoginHeader,
    LoginContainer,
    LoginSlug,
    LoginFooter
  }
})
export default class Login extends Vue {
  private isRender = false
  private config: LoginPagesConfig = {}
  private tenant: LoginTenant = {}

  mounted() {
    this.getConfig()
  }

  @Watch('$route')
  tenantChange() {
    this.getConfig()
  }

  async getConfig() {
    LoginStore.TenantUUID = this.uuid
    if (this.isEnterSlug) return
    await getLoginPage(this.$route).then(() => {
      this.config = LoginStore.Config
      this.tenant = LoginStore.Tenant
      this.isRender = true
    })
  }

  get uuid(): string | null {
    const tenant = this.$route.query.tenant
    return tenant ? (typeof tenant === 'string' ? tenant : tenant[0]) : null
  }

  get slug(): string | null {
    const slug = this.$route.query.slug
    return slug ? (typeof slug === 'string' ? slug : slug[0]) : null
  }

  get isEnterSlug(): boolean {
    return this.slug === 'null'
  }
}
</script>
