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
  
}