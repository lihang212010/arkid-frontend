<template>
  <div
    v-if="visible && isRender"
    class="login-container"
  >
    <div
      class="left"
      :class="{'hidden': hidden}"
    >
      <AppLogo
        :name="name"
        :icon="icon"
        class="left-logo"
      />
      <img
        src="./assets/login-box-bg.svg"
        alt=""
        class="left-bg-img"
      >
      <h1 class="left-name">
        {{ name }}
      </h1>
    </div>
    <div class="right">
      <LoginForms :configs="configs" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Prop, Component, Watch } from 'vue-property-decorator'
import AppLogo from './components/AppLogo.vue'
import LoginForms from './components/LoginForms.vue'
import LoginStore from './store/login'
import { LoginPagesConfig, ButtonConfig, LoginPageConfig } from './interface'
import getBaseUrl from '@/utils/get-base-url'
import http from './http'

@Component({
  name: 'Login',
  components: {
    AppLogo,
    LoginForms
  }
})
export default class Login extends Vue {
  private isRender = false;
  private name = 'ArkID'
  private icon = ''
  private configs: LoginPagesConfig = {}

  get hidden() {
    return document.body.clientWidth <= 900
  }

  get visible() {
    return LoginStore.token === null
  }

  get uuid(): string | null {
    const tenant = this.$route.query.tenant
    return tenant ? typeof tenant === 'string' ? tenant : tenant[0] : null
  }

  get next(): string | null {
    const next = this.$route.query.next
    return next ? typeof next === 'string' ? next : next[0] : null
  }

  created() {
    this.getLoginPage()
  }

  @Watch('$route')
  tenantChange() {
    this.getLoginPage()
  }

  async getLoginPage() {
    // next query
    if (this.next) this.toNext()

    LoginStore.TenantUUID = this.uuid
    const url = this.uuid ? `/api/v1/loginpage/?tenant=${this.uuid}` : '/api/v1/loginpage/'
    const resp = await http.get(url)
    const { tenant, data } = resp.data
    if (tenant) {
      const { name, icon, password_complexity: complexity } = tenant
      this.name = name
      this.icon = icon
      LoginStore.RigisterPasswordComplexity = complexity
    }
    Object.keys(data).forEach(key => {
      const config = data[key]
      if (config?.extend) {
        this.configs[key] = {
          ...config,
          extend: this.extendLogin(config.extend)
        }
      } else {
        this.configs[key] = config
      }
    })
    this.isRender = true
  }

  toNext() {
    let next = this.next!
    const query = this.$route.query
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

  extendLogin(extend: { buttons: Array<ButtonConfig>, title: string }) {
    if (!LoginStore.ThirdUserID && !LoginStore.BindUrl && extend && extend.buttons) {
      extend.buttons.forEach((btn: ButtonConfig) => {
        btn.img = btn.img || 'extend-icon'
        btn.redirect!.params = {
          next: encodeURIComponent(window.location.origin + getBaseUrl() + '/third_part_callback')
        }
      })
      return extend
    } else {
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    color: white;
    margin-left: 100px;
    box-sizing: border-box;

    &-logo {
      position: absolute;
      top: 100px;
    }

    &-bg-img {
      width: 300px;
    }

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin-left: -48%;
      background-image: url('./assets/login-bg.svg');
      background-position: 100%;
      background-repeat: no-repeat;
      background-size: auto 100%;
      content: '';
      z-index: -1;
    }
  }

  .left.hidden {
    display: none;
  }

  .right {
    flex: 1;
    display: flex;
    justify-content: center;
  }
}
</style>
