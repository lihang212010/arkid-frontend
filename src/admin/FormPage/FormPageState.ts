import CardState from '../common/Card/CardState'
import FormState from '../common/Form/FormState'
import SelectState from '../common/Form/Select/SelectState'
import ButtonState from '@/admin/common/Button/ButtonState' 
import DialogState from '@/admin/common/Dialog/DialogState'
import DescriptionsState from '@/admin/common/Descriptions/DescriptionsState'
import { IFlow } from '@/arkfbp'

export interface FormGroupState extends FormState {
  name?: string
  title?: string
}

export interface FormPage extends CardState {
  form?: FormState
  dialogs?: { [dialogName: string]: DialogState }
  card?: CardState
  select?: SelectState
  forms?: {[value:string]: FormState}
  buttons?: Array<ButtonState>
  actions?: { [name: string]: (IFlow | string)[] }
  data?: any
  descriptions?: DescriptionsState
  groups?: FormGroupState[]
}