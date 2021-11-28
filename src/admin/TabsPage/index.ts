import { BaseState } from '@/admin/base/BaseVue'
import CardState from '@/admin/common/Card/CardState'
import DialogState from '@/admin/common/Dialog/DialogState'

export interface TabsPageState extends BaseState {
  tabs: string[]
  card?: CardState
  dialogs?: { [name: string]: DialogState }
}

export const useTabsPage = (): TabsPageState => {
  return {
    card: {
      title: '',
      buttons: []
    },
    tabs: [],
    dialogs: {}
  }
}