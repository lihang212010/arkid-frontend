import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitSortable extends FunctionNode {
  async run() {
    const tempState = this.inputs.state as TablePageState
    const initContent = this.inputs.data.initContent
    if (initContent.sort) {
      const sortOperationPath = initContent.sort.batch.path
      const sortOperationMethod = initContent.sort.batch.method
      const listOperationPath = initContent.list.path
      const listOperationMethod = initContent.list.method
      if (tempState.table) {
        tempState.table.sortable = true
        tempState.table.sortAction = [
          {
            name: 'flows/tablePage/sort',
            params: {
              sortUrl: sortOperationPath,
              sortMethod: sortOperationMethod,
              fetchUrl: listOperationPath,
              fetchMethod: listOperationMethod,
              sortType: 'batch'
            }
          }
        ]
      }
      // 给 table 表格项添加一项 <排序>
      const columnSort = {
        prop: 'sort',
        label: '排序',
        scope: {
          type: 'Sort',
          state: new Array(),
        }
      }
      // 判断有什么类型的排序
      Object.keys(initContent.sort).forEach((sortName) => {
        if (sortName !== 'batch') {
          columnSort.scope.state.push({
            type: sortName,
            action: [
              {
                name: 'flows/tablePage/sort',
                params: {
                  sortUrl: initContent.sort[sortName].path,
                  sortMethod: initContent.sort[sortName].method,
                  fetchUrl: listOperationPath,
                  fetchMethod: listOperationMethod,
                  sortType: sortName,
                }
              }
            ]
          })
        }
      })
      // 将 columnSort 添加给 table
      tempState.table?.columns?.push(columnSort)
    }
    
    return {
      data: this.inputs.data,
      state: tempState
    }
  }
}