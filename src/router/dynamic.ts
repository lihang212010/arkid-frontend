import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import Admin from '@/admin/main/index.vue'
import { UserModule, UserRole } from '@/store/modules/user'
import OpenAPI, { ISpec, IOpenAPIRouter } from '@/config/openapi'
import hasPermission from '@/utils/role'
import { ConfigModule } from '@/store/modules/config'

interface RouteMeta {
  title: string
  icon: string
  page?: string
  affix?: boolean
  hidden?: boolean
  url?: string
  roles?: Array<string>
}

// 根据OpenAPI信息动态生成当前登录用户所拥有权限的路由
export function getDynamicRoutes() {
  const openAPI: ISpec | undefined = OpenAPI.instance.config
  if (!openAPI?.info?.routers) return []
  const openAPIRoutes = openAPI.info.routers
  let routes: RouteConfig[] = processOpenAPIRoutes(openAPIRoutes)
  // staged code
  routes = filterRoutes(routes)
  return routes
}

function processOpenAPIRoutes(routes: IOpenAPIRouter[]): RouteConfig[] {
  const realRoutes: RouteConfig[] = []
  for (let i = 0, len = routes.length; i < len; i++) {
    const router = generateRoute(routes[i])
    if (!router) continue
    realRoutes.push(router)
  }
  return realRoutes
}

function generateRoute(route: IOpenAPIRouter): RouteConfig | undefined {
  const { path, children, page } = route
  if (path && hiddenRoute(path)) return undefined
  if (page && !hasPermission(page)) return undefined
  const newRoute: RouteConfig = {
    path: '/' + path,
    name: path,
    component: Layout,
    meta: getRouteMeta(route),
    children: [
      {
        path: '',
        name: path,
        component: Admin,
        meta: getRouteMeta(route, true)
      }
    ]
  }
  if (children) {
    const childRoutes = generateChildRoutes(children)
    newRoute.children = childRoutes
  }
  return newRoute
}

function generateChildRoutes(routes: IOpenAPIRouter[], isAdmin: boolean = true): RouteConfig[] {
  const childRoutes: RouteConfig[] = []
  if (routes) {
    for (let i = 0, len = routes.length; i < len; i++) {
      const page = routes[i].page
      if (page && !hasPermission(page)) continue
      const { path, children } = routes[i]
      if (UserModule.role !== UserRole.Global && path === 'tenant_list') {
        continue
      }
      const childRoute = {
        path: path,
        name: path,
        component: isAdmin ? Admin : undefined,
        children: children ? generateChildRoutes(children, false) : undefined,
        meta: getRouteMeta(routes[i])
      }
      if (children) {
        const childrenRoutes = generateChildRoutes(children, false)
        if (!childrenRoutes.length) continue
      }
      childRoutes.push(childRoute)
    }
  }
  return childRoutes
}

function getRouteMeta(route: IOpenAPIRouter, affix?: boolean): RouteMeta {
  const { name, icon, page, url } = route
  const meta: RouteMeta = {
    title: name,
    icon: icon || 'dashboard',
    page,
    affix: affix || false,
    url
  }
  return meta
}

// extra function - only staged code
function filterRoutes(routes: RouteConfig[]): RouteConfig[] {
  const role = UserModule.role
  let roleRoutes = routes
  if (role === UserRole.User) {
    roleRoutes = routes.filter((route) => {
      return route.path === '/contacts' || route.path === '/mine' || route.path === '/desktop'
    })
  } else if (role === UserRole.Tenant) {
    roleRoutes = routes.filter((route) => {
      return route.path !== '/system'
    })
  }
  return roleRoutes
}

function hiddenRoute(path: string): boolean {
  if (path === 'desktop') {
    return !ConfigModule.desktop.visible
  } else if (path === 'contacts') {
    return !ConfigModule.contacts.isOpen
  } else {
    return false
  }
}