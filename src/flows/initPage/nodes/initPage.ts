import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'
import { ITagPage } from '@/config/openapi'

export class InitPage extends FunctionNode {
  async run() {
    const initContent = this.inputs.initContent
    const currentPage = this.inputs.currentPage
    const isMultiPage = Array.isArray(initContent)
    let state
    if (isMultiPage) {
      state = []
      for (let i = 0; i < initContent.length; i++) {
        const pageState = await this.initPage(initContent[i])
        state.push(pageState)
      }
    } else {
      state = await this.initPage(initContent)
    }
    await this.runCustomPageFlow(state, initContent, currentPage)
    return {
      state: state
    }
  }

  async initPage(initContent: ITagPage) {
    let state
    let initFileName = ''
    switch (initContent.type) {
      case 'table_page':
      case 'form_page':
      case 'tree_page':
        initFileName = 'flows/basePage'
        break
      case 'dashboard_page':
        initFileName = 'flows/dashboardPage/init'
        break
    }
    await runFlowByFile(initFileName, {
      initContent: initContent
    }).then(async (data) => {
      state = data.state
    })
    return state
  }

  async runCustomPageFlow(state: any, initContent: ITagPage, currentPage: string) {
    let curstomPageFlow: string = ''
    switch (currentPage) {
      case 'app':
        curstomPageFlow = 'flows/appManager/authPageBtn'
        break
      case 'group':
        curstomPageFlow = 'flows/group/changeFetch'
        break
      case 'maketplace':
        curstomPageFlow = 'flows/maketplace/initFilter'
        break
      case 'third_party_account':
        curstomPageFlow = 'flows/thirdPartyAccount/addUnbindButton'
    }
    if (curstomPageFlow !== '') {
      await runFlowByFile(curstomPageFlow, {
        state: state,
        initContent: initContent
      })
    }
  }
}