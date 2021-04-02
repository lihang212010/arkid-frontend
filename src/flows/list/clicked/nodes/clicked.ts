import { FunctionNode } from 'arkfbp/lib/functionNode'

export class Clicked extends FunctionNode {

  addOrCancelListItem(listItems, currentClickedData) {
    if (listItems.length === 0) return -1
    let index = -1
    listItems.forEach((listItem, listIndex) => {
      if (listItem.value === currentClickedData.value) {
        index = listIndex
      }
    })
    return index
  }

  async run() {

    const tempState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    const params = this.inputs.params
    const data = params.data
    const multi = params.multi

    // isSingle 仅仅用于在 table 表格中进行选择时，判断是一次性全选，还是单击选框--单独选择
    const isSingle = params.isSingle

    // actionType 仅仅用于在 tree 树结构中进行选择时，区别当前节点的操作类型，目前分为三种 expand(展开)、click(点击)、check(复选框)
    // 当expand展开时，将不再执行下面的内容
    // 当click点击时，默认只存储当前这一个tree节点的内容
    // 当check复选时，也将会存储当前这一个tree节点的children内容
    const treeNodeActionType = params.actionType

    if (treeNodeActionType === "expand") return 

    // 定义当前点击的数据
    let currentClickedData
    // 判断当前的是否为table表格中的全选
    // tree结构的内容选择时，data为Object
    // table结构的内容选择时，如果为单选-data为Object，如果为多选-data为Array，取消时data为空数组
    if (isSingle || params.type === 'tree') {
      currentClickedData = {}
      currentClickedData['value'] = data.uuid
      currentClickedData['label'] = data.label || data.name || ''
    } else {
      currentClickedData = []
      if (data.length > 0) {
        data.forEach(idata => {
          currentClickedData.push({
            value: idata.uuid,
            label: idata.label || idata.name || '',
          })
        })
      }
    }

    // 获取当前的list已选择的列表数据 -- 对数据进行取舍
    let listItems = tempState.dialogs.selected.state.selected.list.items
    
    // 判断是否为多选
    if (multi) {
      // 说明是一次性多选
      if (currentClickedData instanceof Array) {
        if (currentClickedData.length > 0) {
          listItems.length = 0
          currentClickedData.forEach((item) => {
            listItems.push(item)
          })
        } else {
          listItems = listItems.splice(0, listItems.length)
        }
      } else {
        if (listItems.length === 0) {
          listItems.push(currentClickedData)
        } else {
          const isExistIndex = this.addOrCancelListItem(listItems, currentClickedData)
          isExistIndex === -1 ? listItems.push(currentClickedData) : listItems.splice(isExistIndex, 1)
        }
      }
    } else {
      const isExistIndex = this.addOrCancelListItem(listItems, currentClickedData)
      if (isExistIndex === -1) {
        listItems.splice(0, listItems.length)
        listItems.push(currentClickedData) 
      } else {
        listItems.splice(0, listItems.length)
      }
    }
  }
}