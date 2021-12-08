interface MainHeaderDataState {
  label: string
  value: string
}

export interface MainHeaderState {
  icon?: string
  title: string
  subtitle?: string
  data?: MainHeaderDataState[]
}