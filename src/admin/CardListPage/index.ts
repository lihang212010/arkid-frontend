import { BaseState } from '../base/BaseVue'
import CardState from '../common/Card/CardState'
import DialogState from '@/admin/common/Dialog/DialogState'
import AdminComponentState from '../common/AdminComponent/AdminComponentState'
import { IFlow } from '@/arkfbp'

interface CardListItemState {
  logo?: string
  name?: string
  uuid?: string
  description?: string
}

interface CardListState {
  items: CardListItemState[]
  slot?: AdminComponentState
}

export interface CardListPage extends BaseState {
  card?: CardState
  actions?: { [name: string]: (IFlow | string)[] }
  dialogs?: { [dialogName: string]: DialogState }
  cards?: CardListState
  data?: any
  pages?: string[]
}

export const useCardListPage = (): CardListPage => {
  return {
    card: {
      title: '',
      buttons: []
    },
    cards: {
      items: [],
      slot: undefined
    },
    pages: [],
    actions: {},
    dialogs: {},
    data: null
  }
}
