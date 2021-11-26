import { BaseState } from '../base/BaseVue'
import CardState from '../common/Card/CardState'
import DialogState from '@/admin/common/Dialog/DialogState'
import { IFlow } from '@/arkfbp'

export interface DescriptionPageState extends BaseState {
  card?: CardState
  data?: any
  dialogs?: { [dialogName: string]: DialogState }
  actions?: { [name: string]: Array<IFlow | string> }
  items: any
}

export const useDescriptionPage = (): DescriptionPageState => {
  return {
    created: '',
    card: {
      title: '',
      buttons: []
    },
    data: null,
    dialogs: {},
    actions: {},
    items: {}
  }
}