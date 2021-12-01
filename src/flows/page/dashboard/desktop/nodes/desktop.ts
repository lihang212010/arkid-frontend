import { FunctionNode } from 'arkfbp/lib/functionNode'
import { getSchemaByPath } from '@/utils/schema'
import generateForm from '@/utils/form'
import OpenAPI, { ITagPageAction } from '@/config/openapi'
import { IFlow } from '@/arkfbp'
import { DashboardGroup } from '@/admin/DashboardPage/DashboardPageState'

export class DesktopNode extends FunctionNode {
  async run() {
    const { state, page, dep, options } = this.inputs
    const { init, global, local } = dep || {}
    const description = options && options.description
    if (!init) return
    const { path, method, tag } = init

    if (page === 'desktop') {
      let fetchAction: IFlow[] = []
      const groups: DashboardGroup[] = []
      if (tag) {
        tag.forEach(t => {
          const info = OpenAPI.instance.getOnePageTag(t)
          if (info && info.page) {
            const tInit = info.page.init
            fetchAction.push({
              name: 'flows/custom/desktop/fetch',
              url: tInit.path, method: tInit.method,
              response: {
                name: info.name,
                title: info.description
              }
            })
            groups.push({
              name: info.name,
              title: '',
              items: []
            })
          }
        })
      } else if (path && method) {
        fetchAction.push({
          name: 'flows/custom/desktop/fetch',
          url: path, method
        })
      }
      state[page] = {
        type: 'DashboardPage',
        state: {
          created: 'created',
          groups,
          endAction: 'keepAppPosition',
          buttons: [],
          actions: {
            created: [ 'fetch' ],
            fetch: fetchAction,
            keepAppPosition: [
              {
                name: 'flows/custom/desktop/adjust'
              }
            ]
          },
          card: {
            title: description,
            buttons: []
          },
          dialogs: {},
          data: null
        }
      }
      const desktopState = state[page].state
      if (local) {
        const { tag: localTag, description: localDescription } = local
        state._pages_.push(localTag)
        const pageName = localTag.substring(localTag.indexOf('.') + 1)
        desktopState.dialogs[pageName] = {
          visible: false,
          page: localTag
        }
        desktopState.actions[`open${pageName}`] = [
          {
            name: 'arkfbp/flows/data'
          },
          {
            name: 'arkfbp/flows/assign',
            response: {
             [`dialogs.${pageName}.visible`]: true
            }
          }
        ]
        desktopState.actions[`close${pageName}`] = [
          {
            name: 'arkfbp/flows/assign',
            response: {
             [`dialogs.${pageName}.visible`]: false
            }
          }
        ]
        desktopState.buttons.push({
          label: localDescription,
          action: `open${pageName}`,
          size: 'mini'
        })
      }
      if (global) {
        const { tag: appManageTag, description: appManageDescription } = global.manage
        state.manage = {
          type: 'FormPage',
          state: {
            created: 'created',
            card: {
              title: appManageDescription
            },
            actions: {
              created: [ 'fetch' ],
              fetch: []
            },
            groups: []
          }
        }
        desktopState.dialogs.manage = {
          page: 'manage',
          visible: false
        }
        desktopState.card.buttons = [
          {
            label: appManageDescription,
            action: 'openManageDialog',
            size: 'mini',
            icon: 'el-icon-edit'
          }
        ]
        desktopState.actions.openManageDialog = [
          {
            name: 'arkfbp/flows/assign',
            response: {
              'dialogs.manage.visible': true
            }
          }
        ]
        const manageState = state.manage.state
        for (const t of appManageTag) {
          const info = OpenAPI.instance.getOnePageTag(t)
          if (info) {
            const { page: manageDep, description: manageDescription, name: manageName } = info
            if (manageDep) {
              const { init: manageInit, local: manageLocal } = manageDep
              manageState.actions.fetch.push({
                name: 'flows/custom/desktop/manage',
                url: manageInit.path, method: manageInit.method,
                response: {
                  name: manageName,
                  title: manageDescription
                }
              })
              manageState.actions[manageName] = [
                {
                  name: 'arkfbp/flows/data'
                },
                {
                  name: 'flows/custom/desktop/subscribe',
                  url: (manageLocal as ITagPageAction).path,
                  method: (manageLocal as ITagPageAction).method
                },
                'desktop.fetch'
              ]
            }
          }
        }
      }
    } else {
      if (!state.notice) {
        state.notice = {
          type: 'Notice',
          state: {}
        }
      }
      const noticeLists = state.notice.state
      let items
      if (path && method) {
        const schema = getSchemaByPath(path, method)
        if (schema) {
          const { form } = generateForm(schema, false, true, false, true)
          items = form?.items
        }
      }
      noticeLists[page] = {
        created: 'created',
        title: description || '消息列表',
        items: [],
        isActive: true,
        detail: {
          visible: false,
          state: {
            type: 'Descriptions',
            state: {
              items: items,
              border: true,
              column: 1
            }
          }
        },
        actions: {
          created: [],
          fetch: [
            {
              name: 'flows/common/list',
              url: path, method
            }
          ]
        }
      }
      const actions = noticeLists[page].actions
      if (path && method) {
        actions.created.push('fetch')
      }
    }
  }
}