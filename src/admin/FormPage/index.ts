import CardState from '../common/Card/CardState'
import FormState from '../common/Form/FormState'
import SelectState from '../common/Form/Select/SelectState'
import ButtonState from '@/admin/common/Button/ButtonState' 
import DialogState from '@/admin/common/Dialog/DialogState'
import DescriptionsState from '@/admin/common/Descriptions/DescriptionsState'
import { IFlow } from '@/arkfbp'

export interface FormPageState extends CardState {
  form?: FormState
  dialogs?: { [dialogName: string]: DialogState }
  card?: CardState
  select?: SelectState
  forms?: {[value:string]: FormState}
  buttons?: Array<ButtonState>
  actions?: { [name: string]: (IFlow | string)[] }
  data?: any
  descriptions?: DescriptionsState
}

export const useFormPage = (): FormPageState => {
  return {
    created: '',
    form: {},
    dialogs: {},
    card: {
      title: '',
      buttons: []
    },
    data: null,
    actions: {}
  }
}