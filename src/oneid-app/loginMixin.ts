import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator'
import {Route} from 'vue-router'
import {injectLoginRequired} from '../services/base'
import * as api from '../services/oneid'


@Component({})
export default class LoginMixin extends Vue {
  user: {
    isLogin?: boolean,
    hasAccessToAdmin?: boolean,
  }|null = null

  get isLogin(): boolean {
    return Boolean(this.user && this.user.isLogin)
  }
  get hasAccessToAdmin(): boolean {
    return Boolean(this.isLogin && this.user && this.user.hasAccessToAdmin)
  }

  get isShowContacts(): boolean {
    return (this.$app.metaInfo && this.$app.metaInfo.contacts && this.$app.metaInfo.contacts.show) || false
  }

  @Watch('isLogin')
  onLoginChange(val: LoginMixin['isLogin']) {
    if (!val) {
      this.resolveNavigation()
    }
  }

  created() {
    injectLoginRequired(() => {
      this.user = null
    })

    this.$router.beforeEach((to, from, next) => {

      if (!this.isLogin && this.isRouteRequireLogin(to)) {
        next({
          name: 'oneid.login',
          query: {
            backPath: to.fullPath,
          },
        })
        return
      }

      if (to.name === 'workspace.contacts' && !this.isShowContacts) {
        next({
          name: 'workspace.apps',
        })
        return
      }

      if (this.user && !this.user!.hasAccessToAdmin && this.isRouteRequireAdmin(to)) {
        next({
          name: 'workspace.apps',
        })
        return
      }

      if (this.user && this.user!.is_extern_user && this.isRouteRequireIntern(to)) {
        next({
          name: 'workspace.apps',
        })
        return
      }

      next()
    })

    this.loadCachedUser()
    this.resolveNavigation()
  }

  // getLoginPath(): string | void {
  // }

  resolveNavigation(): void {
    if (!this.isLogin && this.isRouteRequireLogin(this.$route)) {
      this.$router.push({
        name: 'oneid.login',
        query: {
          backPath: this.$route.fullPath,
        },
      })
      return
    }

    if (this.user && !this.user!.hasAccessToAdmin && this.isRouteRequireAdmin(this.$route)) {
      this.$router.push({
        name: 'workspace.apps',
      })
      return
    }

    if (this.user && this.user!.is_extern_user && this.isRouteRequireIntern(this.$route)) {
      this.$router.push({
        name: 'workspace.apps',
      })
      return
    }
  }

  isRouteRequireLogin(route: Route): boolean {
    return !route.name || [
      'oneid.login',
      'oneid.signup',
      'oneid.activate',
      'oneid.password',
      'oneid.registersuccess',
      'oneid.bindThirdParty',
    ].indexOf(route.name) === -1
  }

  isRouteRequireIntern(route: Route): boolean {
    return !!route.name && route.name.startsWith('workspace.contacts')
  }

  isRouteRequireAdmin(route: Route): boolean {
    return !!route.name && route.name.startsWith('admin')
  }

  onLogin(user: {}): void {
    this.user = user
  }

  async logout() {
    await api.UCenter.revokeToken()
    api.logout()
    this.doLogout()
  }

  doLogout() {
    this.user = null
  }

  loadCachedUser() {
    const cachedUser = api.getCachedUser()
    if (cachedUser) {
      this.onLogin({
        isLogin: true,
        ...cachedUser,
      })
    }
  }

}
