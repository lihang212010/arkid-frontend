<template>
  <div class="login">
    <LoginHeader
      :icon="tenant.icon"
      :name="tenant.name"
    />
    <LoginSlug v-if="isRequiredInputSlug" />
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

  async mounted() {
    await this.getLoginPage()
  }

  @Watch('$route')
  tenantChange() {
    this.getLoginPage()
  }

  get uuid(): string | null {
    const tenant = this.$route.query.tenant
    return tenant ? (typeof tenant === 'string' ? tenant : tenant[0]) : null
  }

  get slug(): string | null {
    const slug = this.$route.query.slug
    return slug ? (typeof slug === 'string' ? slug : slug[0]) : null
  }

  get isRequiredInputSlug(): boolean {
    return this.slug === 'null'
  }

  async getLoginPage() {
    if (this.isRequiredInputSlug) return

    const query = this.$route.query
    let next: any = query && query.next
    if (next) {
      const keys = Object.keys(query)
      for (const key of keys) {
        if (key === 'next') continue
        next += `&${key}=${query[key]}`
      }
      if (next.indexOf('?') === -1) next = next.replace('&', '?')
      next = window.location.origin + next
      LoginStore.NextUrl = next
      if (LoginStore.token) {
        const prefix = next.includes('?') ? '&' : '?'
        window.location.replace(next + `${prefix}token=` + LoginStore.token)
      }
    }

    LoginStore.TenantUUID = this.uuid
    let url = '/api/v1/loginpage/'
    if (LoginStore.TenantUUID) {
      url = '/api/v1/loginpage/?tenant=' + LoginStore.TenantUUID
    }
    const response = await http.get(url)
    const page = response.data
    const { tenant, data } = page
    const config = {}
    Object.keys(data).forEach(key => {
      if (key === 'login') {
        config[key] = {
          ...data[key],
          extend: this.extendLogin(data[key].extend)
        }
      } else {
        config[key] = data[key]
      }
    })
    this.config = config
    this.tenant = tenant
    this.isRender = true
  }

  // third-party
  private extendLogin(extend: { buttons: Array<ButtonConfig>, title: string }) {
    let next = window.location.origin + getBaseUrl() + '/third_part_callback'
    if (LoginStore.NextUrl) next = `${next}&next=${LoginStore.NextUrl}`
    if (!LoginStore.ThirdUserID && !LoginStore.BindUrl && extend && extend.buttons) {
      extend.buttons.forEach((btn: ButtonConfig) => {
        btn.img = btn.img || 'extend-icon'
        btn.redirect!.params = {
          next: encodeURIComponent(next)
        }
      })
      return extend
    } else {
      return null
    }
  }
}
</script>
