import { BaseState } from '@/admin/base/BaseVue'
import CardState from '@/admin/common/Card/CardState'
import DialogState from '@/admin/common/Dialog/DialogState'
import AdminComponentState from '../common/AdminComponent/AdminComponentState'

export interface TabsPageState extends BaseState {
  items?: AdminComponentState[]
  card?: CardState
  dialogs?: { [name: string]: DialogState }
}

export const useTabsPage = (): TabsPageState => {
  return {
    card: {
      title: '',
      buttons: []
    },
    items: [],
    dialogs: {}
  }
}