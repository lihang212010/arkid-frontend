import CardState from '@/admin/common/Card/CardState'
import { BaseState } from '@/admin/base/BaseVue'
import DialogState from '@/admin/common/Dialog/DialogState'
import { IFlow } from '@/arkfbp'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
import FormState from '../common/Form/FormState'
import PaginationState from '../common/data/Pagination/PaginationState'

export interface DashboardGroup {
  name?: string
  title?: string
  options?: any
  items: AdminComponentState[]
}

export interface DashboardPage extends BaseState {
  filter?: FormState
  actions?: { [name: string]: Array<IFlow | string> }
  card?: CardState
  dialogs?: { [dialogName: string]: DialogState }
  groups?: DashboardGroup[]
  changeAction?: string | Function
  moveAction?: string | Function
  startAction?: string | Function
  endAction?: string | Function
  action?: string | Function // ... operation ...
  data?: any
  pagination?: PaginationState
}