import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ISchema, IPageOperation } from '@/config/openapi'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import { BasePageOptions } from '@/flows/initPage/nodes/initPage'
import FormItemState from '@/admin/common/Form/FormItem/FormItemState'
import { FormItemsState } from '@/admin/common/Form/FormState'
import ButtonState from '@/admin/common/Button/ButtonState'
import { TABLE_COLUMN_WIDTH } from '@/utils/table'
import { getSchemaByPath, getParamsByPath } from '@/utils/schema'
import generateForm from '@/utils/form'
import hasPermission, { hasPermissionByPath } from '@/utils/role'
import { isArray } from 'lodash'

enum ACTION_TYPE {
  Global = 'global',
  Local = 'local',
}

interface ButtonDep {
  operation: IPageOperation
  key: string
  actionName?: string
  actionType?: ACTION_TYPE
}

export class PageStateNode extends FunctionNode {
  private _admin: any = null // 当前路由管理state
  private _page: string = '' // 当前需要初始化state的页面名称
  private _type: string = '' // 当前页面的类型
  private _temp: any = {} // 当前页面临时state
  private _opts: BasePageOptions = {} // 一些临时性配置选项

  async run() {
    const { dep, state, page, options } = this.inputs
    const { init, local, global } = dep
    this._admin = state
    this._page = page
    this._temp = state[page].state
    this._type = state[page].type
    this._opts = options
    if (init) this.initPageMainState(init)
    if (local) this.initPageLocalOperations(local)
    if (global) this.initPageGlobalOperations(global)
    return this.inputs
  }

  initPageMainState(init: IPageOperation) {
    const { path, method, tag: page } = init
    if (page) this.addPage(page)
    let schema
    if (path && method) schema = getSchemaByPath(path, method)
    switch (this._type) {
      case 'TablePage':
        this.initTableMainState(schema)
        break
      case 'FormPage':
        this.initFormMainState(schema)
        break
      case 'CardListPage':
        this._temp.pages = page
        break
      default:
        return
    }
    this.initPageFilterState(init, schema)
  }

  addPage(page: string | string[]) {
    const pages = this._admin._pages_
    if (typeof page === 'string') {
      if (pages.indexOf(page) === -1) {
        pages.push(page)
      }
    } else {
      for (let i = 0, l = page.length; i < l; i++) {
        if (pages.indexOf(page) === -1) {
          pages.push(page)
        }
      }
    }
  }

  initTableMainState(schema: ISchema) {
    const { _temp: state, _opts: options, _page: page } = this
    state.table.isExpand = options?.tableIsExpand
    for (const prop in schema.properties) {
      const iprop = schema.properties[prop]
      const title = iprop.title
      const columnState: TableColumnState = {
        label: title,
        prop: prop,
        width: TABLE_COLUMN_WIDTH[page] && TABLE_COLUMN_WIDTH[page][prop],
        showOverflowTooltip: true
      }
      if (prop === 'url' || iprop.format === 'uri') {
        columnState.scope = {
          type: 'Link',
          state: {
            value: '',
            displayContent: 'link',
            type: 'primary'
          }
        }
      }
      if (prop === 'logo' || prop === 'icon') {
        columnState.scope = {
          type: 'ImageBox',
          state: {
            value: ''
          }
        }
      }
      state.table.columns.push(columnState)
    }
  }

  initFormMainState(schema: ISchema) {
    const { _temp: state, _opts: options } = this
    const { showReadOnly, showWriteOnly, disabled } = options
    const { form, forms, select } = generateForm(schema, showReadOnly, showWriteOnly, disabled)
    if (form) {
      const items = form.items
      state.form!.items = items
      if (items) {
        const results = this.getInputListItems(items)
        if (results.length > 0) {
          results.forEach(item => {
            this.initInputList(item)
          })
        }
      }
    } else if (forms) {
      state.forms = forms
      state.select = select
      state.form = undefined
      Object.keys(forms).forEach(key => {
        const items = forms[key].items
        if (items) {
          const inputListItems = this.getInputListItems(items)
          if (inputListItems && inputListItems.length > 0) {
            inputListItems.forEach(item => {
              this.initInputList(item)
            })
          }
        }
      })
    }
  }

  getInputListItems(items: FormItemsState, results: FormItemState[] = []) {
    Object.keys(items).forEach(key => {
      const item = items[key]
      if (item.type === 'FormObjectItem') {
        this.getInputListItems(item.state.items, results)
      } else if (item.type === 'InputList') {
        results.push(item)
      }
    })
    return results
  }

  initPageFilterState(init: IPageOperation, schema: ISchema) {
    const { path, method } = init
    if (!path || !method || !schema) return
    const properties = schema.properties
    const params = getParamsByPath(path, method)
    if (!params || !properties) return
    const state = this._temp
    params.forEach(param => {
      const point = param.in
      const name = param.name
      if (point === 'query' && properties[name]) {
        if (!state.filter) {
          state.filter = {
            inline: true,
            size: 'mini',
            items: {}
          }
        }
        const label = properties[name].title || name
        state.filter.items![name] = {
          type: 'Input',
          isSetWidth: false,
          label,
          state: {
            value: '',
            placeholder: `请输入${label}`,
            clearable: true
          }
        }
      }
    })
    if (state.filter) {
      state.filter.items!.action = {
        type: 'Button',
        isSetWidth: false,
        state: {
          label: '搜索',
          type: 'primary',
          action: 'fetch',
          icon: 'el-icon-search',
          size: 'mini'
        }
      }
    }
  }

  initPageLocalOperations(local: IPageOperation[] | IPageOperation) {
    let key = 'local'
    if (isArray(local)) {
      for (let i = 0, l = local.length; i < l; i++) {
        key = `${key}_${i}`
        const operation = local[i]
        this.initPageOperationState(operation, key)
        this.initLocalButton({ operation, key, actionType: ACTION_TYPE.Local })
      }
    } else {
      this.initPageOperationState(local, key)
      this.initLocalButton({ operation: local, key, actionType: ACTION_TYPE.Local })
    }
  }

  initPageGlobalOperations(global: IPageOperation[] | IPageOperation) {
    let key = 'global'
    if (isArray(global)) {
      for (let i = 0, l = global.length; i < l; i++) {
        key = `${key}_${i}`
        const operation = global[i]
        this.initPageOperationState(operation, key)
        this.initGlobalButton({ operation, key, actionType: ACTION_TYPE.Global })
      }
    } else {
      this.initPageOperationState(global, key)
      this.initGlobalButton({ operation: global, key, actionType: ACTION_TYPE.Global })
    }
  }

  initPageOperationState(operation: IPageOperation, key: string) {
    let { tag: page, type } = operation
    if (page) {
      this.initDialogPageState(page as string, key)
    } else {
      switch (type) {
        case 'import':
          this.initImportDialog()
          break
        case 'sort':
          this.initSortOperation()
          break
        case 'password':
          this.initPasswordDialog()
      }
    }
  }

  initDialogPageState(page: string, key: string) {
    this.addPage(page)
    this._temp.dialogs[key] = {
      visible: false,
      page
    }
  }

  initImportDialog() {

  }

  initPasswordDialog() {

  }

  initSortOperation() {

  }

  initInputList(item: FormItemState) {
    const { _temp: state, _page: page } = this
    item.state.parent = page
    const listPage = item.state.page
    this.addPage(listPage)
    // add init inputlist state
    state.dialogs![listPage] = {
      visible: false,
      page: listPage
    }
    state.actions![`close${listPage}`] = [
      {
        name: 'arkfbp/flows/assign',
        response: {
          [`dialogs.${listPage}.visible`]: false
        }
      }
    ]
    state.actions!.initInputList = [
      {
        name: 'flows/common/inputList/init'
      }
    ]
  }

  initLocalButton(dep: ButtonDep) {
    const button = this.getButton(dep)
    if (button) {
      switch (this._type) {
        case 'TablePage':
          this.initTableLocalButton(button)
          break
        case 'TreePage':
          this.initTreeLocalButton(button)
          break
        case 'CardListPage':
          this.initCardListLocalButton(button)
          break
        case 'ListPage':
          this.initListLocalButton(button)
      }
    }
  }

  initTableLocalButton(button: ButtonState) {
    const state = this._temp
    const columns = state.table.columns
    const len = columns.length
    if (columns[len - 1].prop !== 'actions') {
      columns.push(
        {
          prop: 'actions',
          fixed: 'right',
          label: '操作',
          width: '50',
          scope: {
            type: 'ButtonDropdown',
            state: []
          }
        }
      )
      columns[len].scope.state.push(button)
    } else {
      columns[len - 1].scope.state.push(button)
    }
  }

  initTreeLocalButton(button: ButtonState) {
    const state = this._temp
    const slot = state.tree.slot
    if (slot === undefined) {
      state.tree.slot = {
        buttons: {
          type: 'ButtonArray',
          state: []
        }
      }
    }
    slot.buttons.state.push(button)
  }

  initCardListLocalButton(button: ButtonState) {
    const state = this._temp
    const slot = state.cards.slot
    if (slot === undefined) {
      state.cards.slot = {
        type: 'ButtonArray',
        state: []
      }
    }
    slot.state.push(button)
  }

  initListLocalButton(button: ButtonState) {
    const state = this._temp
    const slot = state.list.slot
    if (slot === undefined) {
      state.list.slot = {
        type: 'ButtonArray',
        state: []
      }
    }
    slot.state.push(button)
  }

  initGlobalButton(dep: ButtonDep) {
    const { _type: type, _temp: state, _opts: options, _page: page } = this
    const button = this.getButton(dep)
    if (button) {
      if (type === 'FormPage') {
        state.buttons.push(button)
      } else {
        state.card.buttons.push(button)
      }
    }
  }

  getButton(dep: ButtonDep) {
    const { operation, key, actionName, actionType } = dep
    let { path, method, tag, type, description, icon, write, read } = operation
    if (path && method) {
      if (!hasPermissionByPath(path, method)) return null
    } else if (tag) {
      if (!hasPermission(tag)) return null
    }
    const action = actionName === '' ? ( tag ? `open_${key}` : key ) : actionName
    let buttonType = 'primary'
    if (method === 'delete' || type === 'logout') buttonType = 'danger'
    if (this._type === 'TreePage' && actionType === ACTION_TYPE.Local) buttonType = 'text'
    return {
      action,
      type: buttonType,
      disabled: false,
      label: description,
      icon,
      size: 'mini'
    }
  }
}