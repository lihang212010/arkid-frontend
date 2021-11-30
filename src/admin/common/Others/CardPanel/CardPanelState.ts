import ButtonState from '@/admin/common/Button/ButtonState'

export default interface CardPanelState {
  name?: string
  description?: string
  logo?: string
  url?: string
  uuid?: string
  class?: string // custom class for styles
  clickAction?: string | Function // display more operations
  buttons?: ButtonState[]
  data?: any
}