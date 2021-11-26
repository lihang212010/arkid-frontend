import { AdminNode } from './adminNode'

export interface IAction {
  name: string
  path: string
  method: string
  request?: any
  response?: any
  next?: string
}

export class ActionNode extends AdminNode {

  async run() {
    await super.run()
  }

  useTableInitAction() {

  }

  useFormInitAction() {

  }

  useTreeInitAction() {

  }

  useCardListInitAction() {

  }

  useListInitAction() {

  }

  useDirectAction(action: IAction) {

  }

  useOpenAction(action: IAction) {

  }

  useCloseAction(action: IAction) {

  }

  useExportAction(action: IAction) {

  }

  useImportAction(action: IAction) {

  }

  useTreeNodeAction(action: IAction) {

  }

  useSortAction(action: any) {

  }

  useFormItemAction(action: IAction) {

  }
}