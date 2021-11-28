import { StateNode } from '@/arkfbp/nodes/stateNode'
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

export class PageStateNode extends StateNode {

  async run() {
    // initial current page status
    await super.run()

    const state = this
    debugger
  }

}