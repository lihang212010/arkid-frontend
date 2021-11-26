import { BaseState } from '@/admin/base/BaseVue'
import AdminComponentState from '../common/AdminComponent/AdminComponentState'
import CardState from '@/admin/common/Card/CardState'
import DialogState from '@/admin/common/Dialog/DialogState'

export interface ListItemState {
  label: string
  value: string
  data?: any
}

export interface ListPageState extends BaseState {
  list?: {
    items: ListItemState[],
    slot?: AdminComponentState
  }
  clearable?: boolean
  card?: CardState
  dialogs?: { [name: string]: DialogState }
  data?: any
}

export const useListPage = (): ListPageState => {
  return {
    created: '',
    card: {
      title: '',
      buttons: []
    },
    list: {
      items: [],
      slot: undefined
    },
    dialogs: {}
  }
}