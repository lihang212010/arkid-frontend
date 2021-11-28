import { BaseState } from '../base/BaseVue'
import CardState from '../common/Card/CardState'
import TableState from '../common/data/Table/TableState'
import FormState from '../common/Form/FormState'
import PaginationState from '../common/data/Pagination/PaginationState'
import DialogState from '../common/Dialog/DialogState'
import ListState from '../common/List/ListState' 
import { IFlow } from '../../arkfbp'

export interface TablePageState extends BaseState {
  filter?: FormState
  table?: TableState
  pagination?: PaginationState
  data?: any
  header?: CardState
  dialogs?: { [name:string]: DialogState }
  list?: ListState
  actions?: { [name: string]: (IFlow | string)[] }
}

export const useTablePage = (): TablePageState => {
  return {
    created: '',
    header: {
      title: '',
      buttons: []
    },
    data: null,
    table: {
      columns: [],
      data: []
    },
    dialogs: {},
    actions: {}
  }
}