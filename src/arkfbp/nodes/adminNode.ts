import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ISchema, IPageAction, IPageActions } from '@/config/openapi'

export class AdminNode extends FunctionNode {

  adminState: any = null
  pageState: any = null
  pageName: string = ''
  pageType: string = ''
  pageOptions: any = null
  pageInitAction?: IPageAction = undefined
  pageLocalActions?: IPageActions = undefined
  pageGlobalActions?: IPageActions = undefined

  async run() {
    const { dep, state, page, options } = this.inputs
    const { init, local, global } = dep || {} 
    this.adminState = state
    this.pageState = state[page].state
    this.pageType = state[page].type
    this.pageName = page
    this.pageOptions = options
    this.pageInitAction = init
    this.pageLocalActions = local
    this.pageGlobalActions = global
  }

}