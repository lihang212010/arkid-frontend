import { StateNode } from '@/arkfbp/nodes/stateNode'
import { ISchema, IPageAction, IPageActions } from '@/config/openapi'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import { BasePageOptions } from '@/flows/initPage/nodes/initPage'
import FormItemState from '@/admin/common/Form/FormItem/FormItemState'
import { FormItemsState } from '@/admin/common/Form/FormState'
import ButtonState from '@/admin/common/Button/ButtonState'
import { TABLE_COLUMN_WIDTH } from '@/utils/table'
import { getSchemaByPath, getParamsByPath } from '@/utils/schema'
import generateForm from '@/utils/form'
import hasPermission, { hasPermissionByPath } from '@/utils/role'

enum ACTION_TYPE {
  Global = 'global',
  Local = 'local',
}

interface ButtonDep {
  operation: IPageAction
  key: string
  actionName?: string
  actionType?: ACTION_TYPE
}

export class PageStateNode extends StateNode {

  async run() {
    const { pageInitAction, pageLocalActions, pageGlobalActions, pageType } = this
    if (pageInitAction) this.addMainState(pageInitAction, pageType)
    if (pageLocalActions) this.addLocalButtonsState()
    if (pageGlobalActions) this.addGlobalButtonsState()
  }

  addMainState(init: IPageAction, pageType: string) {
    
  }

  addLocalButtonsState() {

  }

  addGlobalButtonsState() {

  }
}