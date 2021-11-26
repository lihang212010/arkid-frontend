import { ActionNode } from '@/arkfbp/nodes/actionNode'
import OpenAPI, { ISchema, IPage, IPageOperation } from '@/config/openapi'
import { PAGE_TYPE, ACTION_TYPE } from '@/utils/constant'
import { getContent } from '@/utils/schema'
import { getActionMapping } from '@/utils/generate-action'
import { isArray } from 'lodash'

export class PageActionNode extends ActionNode {
  
  async run() {
    // init current status
    await super.run()
    // get dependent content in current page
    const { _dep: dep, _temp: state, _type: type } = this
    const { init, local, global } = dep
    // add all type action
    if (init) this.addInitAction(init, type)
    if (local) this.processOtherAction(local, type, ACTION_TYPE.LOCAL)
    if (global) this.processOtherAction(global, type, ACTION_TYPE.GLOBAL)
    if (state.filter) this.addFilterAction()
  }

  addInitAction(init: IPageOperation, pageType: string) {
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

  processOtherAction(operation: IPageOperation[] | IPageOperation, pageType: string, actionType: string) {
    if (isArray(operation)) {
      for (const o of operation) {
        this.addClickAction(o, pageType, actionType)
      }
    } else {
      this.addClickAction(operation, pageType, actionType)
    }
  }

  addClickAction(operation: IPageOperation, pageType: string, actionType: string) {

  }
  
  addFilterAction() {
    
  }

}