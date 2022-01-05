import LoginStore from './store/login'
import http from './http'
import type { Route } from 'vue-router'
import { LoginPageExtend, LoginPageConfig, ButtonConfig } from './interface'
import getBaseUrl from '@/utils/get-base-url'

export async function getLoginPage(route: Route) {
  // redirect next
  redirectNext(route)

  const url = LoginStore.TenantUUID ? `/api/v1/loginpage/?tenant=${LoginStore.TenantUUID}` : '/api/v1/loginpage/'
  const response = await http.get(url)
  const { data, tenant } = response.data
  if (!data) return
  LoginStore.Tenant = tenant
  Object.keys(data).forEach(key => {
    const c: LoginPageConfig = data[key]
    if (c.extend) {
      LoginStore.Config![key] = {
        ...c,
        extend: getExtendLogin(c.extend)
      }
    } else {
      LoginStore.Config![key] = c
    }
  })
}

function getExtendLogin(extend: LoginPageExtend) {
  let next = window.location.origin + getBaseUrl() + '/third_part_callback'
  if (LoginStore.NextUrl) next = `${next}&next=${LoginStore.NextUrl}`
  next = encodeURIComponent(next)
  if (!LoginStore.ThirdUserID && !LoginStore.BindUrl && extend.buttons) {
    for (let i = 0, length = extend.buttons.length; i < length; i++) {
      const button = extend.buttons[i]
      if (!button.redirect) continue
      button.redirect.params = {
        ...button.redirect.params,
        next
      }
      if (button.tooltip === 'arkid') LoginStore.ArkidExtendUrl = next
    }
  }
  return extend
}

function redirectNext(route: Route) {
  const query = route.query
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
}