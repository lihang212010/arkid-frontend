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
      let groups: DashboardGroup[] = []
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
          dialogs: {}
        }
      }
      if (global) {
        const { tag: manageTag } = global.manage
        if (manageTag) {
          const info = OpenAPI.instance.getOnePageTag(manageTag)
          if (info) {
            const { page: manageDep, description: manageDescription, name: manageName } = info
            if (manageDep) {
              const { init: manageInit, local: manageLocal } = manageDep
              const desktopState = state[page].state
              desktopState.dialogs[manageName] = {
                page: manageName,
                visible: false
              }
              desktopState.actions = Object.assign(desktopState.actions, {
                openAppManageDialog: [
                  {
                    name: 'arkfbp/flows/assign',
                    response: {
                      [`dialogs.${manageName}.visible`]: true
                    }
                  }
                ]
              })
              desktopState.card.buttons.push(
                {
                  label: manageDescription,
                  action: 'openAppManageDialog',
                  disabled: true,
                  size: 'mini',
                  icon: 'el-icon-edit'
                }
              )
              state[manageName] = {
                type: 'FormPage',
                state: {
                  created: 'created',
                  card: {
                    title: manageDescription
                  },
                  actions: {
                    subscribe: [
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
                  },
                  form: {
                    items: {}
                  }
                }
              }
              const actions = state[page].state.actions
              actions.manage = [
                {
                  name: 'flows/custom/desktop/manage',
                  url: manageInit.path, method: manageInit.method
                }
              ]
              actions.created.push('manage')
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