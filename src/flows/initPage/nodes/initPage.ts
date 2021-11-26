import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'
import OpenAPI from '@/config/openapi'

const SHOW_READONLY_PAGE = [ 'profile', 'app.update', 'external_idp.update', 'log_config', 'admin_log.detail', 'user_log.detail' ]

const DISABLED_PAGE = [ 'profile_config', 'login_register_config', 'tenant_register_privacy_notice', 'system_config', 'system_register_privacy_notice', 'log_config' ]

const EXPAND_TABLE_PAGE = [ 'contacts_user' ]

const READONLY_PAGE = [ 'profile', 'tenant_config' ]

const TABS_PAGE = [ 'profile', 'third_part_account', 'subuser', 'user_token_manage', 'login_register_extension_config', 'tenant_register_privacy_notice', 'login_register_config', 'profile_config_editfields', 'profile_config_logout', 'profile_config_logging', 'profile_config_token' ]

const PAGE_BASE_FLOW = {
  'table_page': 'flows/page/base',
  'form_page': 'flows/page/base',
  'tree_page': 'flows/page/base'
}

const PAGE_MAIN_FLOW = 'flows/page/base'

const DASHBOARD_PAGE_FLOW = {
  'desktop': 'flows/page/dashboard/desktop',
  'notice': 'flows/page/dashboard/desktop',
  'ticket': 'flows/page/dashboard/desktop',
  'article': 'flows/page/dashboard/desktop',
  'announcement': 'flows/page/dashboard/desktop',
  'statistics': 'flows/page/dashboard/statistics',
  'tenant': 'flows/page/dashboard/tenant',
  'marketplace': 'flows/page/dashboard/marketplace',
  'extension': 'flows/page/dashboard/extension'
}

const PAGE_CUSTOM_FLOW = {
  'app': 'flows/custom/appManager/authPageBtn',
  'login_register_config': 'flows/custom/loginRegisterConfig/addAction',
  'login_register_config.update': 'flows/custom/loginRegisterConfig/options',
  'password': 'flows/custom/password/addAction',
  'profile.update': 'flows/custom/user/profile/edit',
  'profile_config_editfields.update': 'flows/custom/editfields/state',
  'subuser': 'flows/custom/subuser/state',
  'third_part_account': 'flows/custom/thirdPartAccount/addUnbindButton',
  'tenant_config': 'flows/custom/tenant/deleteTenant',
  'user_token_manage': 'flows/custom/user/token/state',
  'contacts_switch': 'flows/custom/contactsConfig'
}

export interface BasePageOptions {
  description?: string
  readonly?: boolean
  disabled?: boolean
  showReadOnly?: boolean
  showWriteOnly?: boolean
  tableIsExpand?: boolean
  isTabPage?: boolean
}

export class InitPage extends FunctionNode {

  async run() {
    const state = this.inputs.state
    for (const page of state._pages_) {
      if (state[page]) continue
      await this.runPageMainFlow(page, state)
      await this.runPageCustomFlow(page, state)
    }
  }

  async runPageMainFlow(page: string, state: any) {
    const tag = OpenAPI.instance.getOnePageTag(page)
    if (tag) {
      const { page: dep, description } = tag
      await runFlowByFile(PAGE_MAIN_FLOW, { state, dep, description, page })
    }
  }

  async runPageCustomFlow(page: string, state: any) {
    const customFlow = PAGE_CUSTOM_FLOW[page]
    if (customFlow) {
      // await runFlowByFile(customFlow, { state, page })
    }
  }

  initPageOptions(page: string, options: BasePageOptions) {
    options.showReadOnly = SHOW_READONLY_PAGE.includes(page)
    options.disabled = DISABLED_PAGE.includes(page)
    options.readonly = READONLY_PAGE.includes(page)
    options.tableIsExpand = EXPAND_TABLE_PAGE.includes(page)
    options.isTabPage = TABS_PAGE.includes(page)
    return options
  }
}