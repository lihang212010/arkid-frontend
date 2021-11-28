import { ActionNode } from '@/arkfbp/nodes/actionNode'
import OpenAPI, { ISchema, IPageAction, IPageActions } from '@/config/openapi'
import { PAGE_TYPE, ACTION_TYPE } from '@/utils/constant'
import { getContent } from '@/utils/schema'
import { getActionMapping } from '@/utils/generate-action'
import { isArray } from 'lodash'

export class PageActionNode extends ActionNode {
  
  async run() {
    const { pageInitAction, pageLocalActions, pageGlobalActions, pageType, pageState } = this
    if (pageInitAction) this.addInitAction(pageInitAction, pageType)
    if (pageLocalActions) this.processOtherAction(pageLocalActions, pageType, ACTION_TYPE.LOCAL)
    if (pageGlobalActions) this.processOtherAction(pageGlobalActions, pageType, ACTION_TYPE.GLOBAL)
    if (pageState.filter) this.addFilterAction()
  }

  addInitAction(init: IPageAction, pageType: string) {
    const { path, method, next } = init
    if (!path || !method) return
    switch (pageType) {
      case PAGE_TYPE.TABLE_PAGE:
        this.useTableInitAction()
        break
      case PAGE_TYPE.FORM_PAGE:
        this.useFormInitAction()
        break
      case PAGE_TYPE.TREE_PAGE:
        this.useTreeInitAction()
        break
      case PAGE_TYPE.CARD_LIST_PAGE:
        this.useCardListInitAction()
        break
      case PAGE_TYPE.LIST_PAGE:
        this.useListInitAction()
    }
  }

  processOtherAction(action: IPageActions, pageType: string, actionType: string) {
    const keys = Object.keys(action)
    for (const key of keys) {
      this.addClickAction(action[key], pageType, actionType)
    }
  }

  addClickAction(action: IPageAction, pageType: string, actionType: string) {

  }
  
  addFilterAction() {
    
  }

}