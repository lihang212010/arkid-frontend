import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI, { ISchema, ITagPageAction } from '@/config/openapi'
import { getContent } from '@/utils/schema'
import { ITagPage, ITagUpdateAction } from '@/config/openapi'
import { BasePage, IPage } from './pageNode'
import { addDialogAction, addItemAction, addCardAction, addChildrenAction, addSortAction } from '@/utils/dialog'
import { getActionMapping } from '@/utils/generate-action'

export class ActionNode extends FunctionNode {
  
  async run() {
    const { state, initContent } = this.inputs
    this.initPageFetchAction(state, initContent.init)
    this.initPageOperationAction(state, initContent)
    return this.inputs
  }

  initPageFetchAction(pageState: BasePage, initAction: ITagPageAction) {
    const { path, method } = initAction
    const content = getContent(path, method)
    const { type, state } = pageState
    switch (type) {
      case 'TablePage':
        this.initTablePageFetchAction(state, path, method, content)
        break
      case 'FormPage':
        this.initFormPageFetchAction(state, path, method)
        break
      case 'TreePage':
        this.initTreePageFetchAction(state, path, method, content)
    }
  }

  initTablePageFetchAction(state: IPage, path: string, method: string, content: { [contentType: string]: {schema: ISchema} }) {
    const props = this.getFetchActionPropsBySchema(path, method)
    const response = {},
          request = {}
    response['table.data'] = props.data
    if (props.pagination) {
      response['pagination.total'] = props.pagination
      request['page'] = 'pagination.currentPage'
      request['page_size'] = 'pagination.pageSize'
      state.pagination = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        action: 'fetch'
      }
    }
    this.setImportButtonDisabledProp(state, response, props.data)
    this.addFetchAction(state, path, method, response, request)
  }

  initFormPageFetchAction(state: IPage, path: string, method: string) {
    const isResponse = true
    const target = ''
    const { mapping } = getActionMapping(path, method, target, isResponse)
    this.addFetchAction(state, path, method, mapping)
  }

  initTreePageFetchAction(state: IPage, path: string, method: string, content: { [contentType: string]: {schema: ISchema} }) {
    const props = this.getFetchActionPropsBySchema(path, method)
    const response = {}
    response['tree.data'] = props.data
    this.setImportButtonDisabledProp(state, response, props.data)
    this.addFetchAction(state, path, method, response, undefined, 'arkfbp/flows/fetchTree')
  }

  addFetchAction(state: IPage, path: string, method: string, response?: any, request?: any, flowName?: string) {
    state.created = 'created'
    if (!state.actions) state.actions = {}
    state.actions!.created.push('fetch')
    state.actions.fetch = [
      {
        name: flowName ? flowName : 'arkfbp/flows/fetch',
        url: path,
        method: method,
        response: response,
        request: request
      }
    ]
  }

  initPageOperationAction(pageState: BasePage, initContent: ITagPage) {
    const { state } = pageState
    if (initContent.page) {
      Object.keys(initContent.page).forEach(key => {
        let action = (initContent.page![key] as ITagUpdateAction).read || initContent.page![key]
        addCardAction(state, action.path, action.method, key)
        action = (initContent.page![key] as ITagUpdateAction).write || initContent.page![key]
        addDialogAction(state, action.path, action.method, key)
      })
    }
    if (initContent.item) {
      Object.keys(initContent.item).forEach(key => {
        const item = initContent.item![key]
        if (typeof item !== 'string') {
          let action = (initContent.item![key] as ITagUpdateAction).read || initContent.item![key]
          switch (key) {
            case 'sort':
              addSortAction(state, action)
              break
            case 'children':
              addChildrenAction(state, action.path, action.method)
              break
            default:
              addItemAction(state, action.path, action.method, key)
              action = (initContent.item![key] as ITagUpdateAction).write || initContent.item![key]
              addDialogAction(state, action.path, action.method, key)
          }
        }
      })
    }
  }

  getFetchActionPropsBySchema(path: string, method: string) {
    const content = getContent(path, method)
    const type = Object.keys(content)[0]
    const responseSchema = content[type].schema
    let ref = responseSchema.$ref as string
    if (responseSchema.items) { ref = (responseSchema.items as ISchema).$ref as string }
    const res = OpenAPI.instance.getSchemaByRef(ref)
    const props = { data: '', pagination: '' }
    if (res.properties) {
      const properties = res.properties
      props.pagination = properties.count ? 'count' : ''
      props.data = properties.results ? 'results' : props.data ? 'data' : ''
    }
    return props
  }

  setImportButtonDisabledProp(state: IPage, response: Object, refer: string) {
    const btns = state.card?.buttons
    if (btns) {
      for (let i = 0, len = btns.length; i < len; i++) {
        const btn = btns[i]
        if (btn.label === '导出' || btn.label === 'export') {
          response[`card.buttons[${i}].disabled`] = refer ? `${refer}.length` : 'length'
          break
        }
      }
    }
  }
}