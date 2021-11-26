import { FunctionNode } from 'arkfbp/lib/functionNode'

export class AdminNode extends FunctionNode {

  public _admin: any = null
  public _temp: any = {}
  public _page: string = ''
  public _type: string = ''
  public _opts: any = {}
  public _dep: any = {}

  async run() {
    const { dep, state, page, options } = this.inputs
    this._admin = state
    this._page = page
    this._temp = state[page].state
    this._type = state[page].type
    this._opts = options
    this._dep = dep
  }

}