import { FunctionNode } from 'arkfbp/lib/functionNode'
import { AdminNode } from '@/arkfbp/nodes/adminNode'
import { useTablePage } from '@/admin/TablePage'
import { useFormPage } from '@/admin/FormPage'
import { useTreePage } from '@/admin/TreePage'
import { useCardListPage } from '@/admin/CardListPage'
import { useListPage } from '@/admin/ListPage'
import { useTabsPage } from '@/admin/TabsPage'
import { useDescriptionPage } from '@/admin/DescriptionPage'
import { camelCase } from 'lodash'

const usePage = (type: string) => {
  switch (type) {
    case 'TablePage':
      return useTablePage()
    case 'FormPage':
      return useFormPage()
    case 'TreePage':
      return useTreePage()
    case 'CardListPage':
      return useCardListPage()
    case 'ListPage':
      return useListPage()
    case 'TabsPage':
      return useTabsPage()
    case 'DescriptionPage':
      return useDescriptionPage()
    default:
      return null
  }
}

export class PageCreateNode extends AdminNode {
  async run() {
    const { state, dep, page } = this.inputs
    let type = camelCase(dep.type)
    type = type.charAt(0).toUpperCase() + type.slice(1)
    const pageState = usePage(type)
    if (pageState === null) {
      return null
    } else {
      state[page] = {
        type,
        state: pageState
      }
      return this.inputs
    }
  }
}