import CardState from '@/admin/common/Card/CardState'
import { BaseState } from '@/admin/base/BaseVue'
import DialogState from '@/admin/common/Dialog/DialogState'
import { IFlow } from '@/arkfbp'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export interface DashboardPage extends BaseState {
  actions?: { [name: string]: Array<IFlow | string> }
  card?: CardState
  dialogs?: { [dialogName: string]: DialogState }
  items?: AdminComponentState[]
  options?: any
  changeAction?: string | Function
  moveAction?: string | Function
  startAction?: string | Function
  endAction?: string | Function
  action?: string | Function // ... operation ...
  data?: any
}