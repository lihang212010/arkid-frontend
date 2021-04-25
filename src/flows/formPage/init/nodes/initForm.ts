import { FunctionNode } from 'arkfbp/lib/functionNode'
import FormPageState from '@/admin/FormPage/FormPageState'
import OpenAPI from '@/config/openapi'
import getSchemaByContent from '@/utils/get-schema-by-content'
import generateDialogForm from '@/utils/generate-dialog-form'

export class InitForm extends FunctionNode {
  async run() {
    const tempState: FormPageState = this.inputs.state
    const initContent = this.inputs.data.initContent
    let baseAction = {
      fetchUrl: '',
      fetchMethod: ''
    }
    if (initContent?.init) {
      const initFormPath = initContent.init.path as string
      const initFormMethod = initContent.init.method as string
      baseAction.fetchUrl = initFormPath
      baseAction.fetchMethod = initFormMethod
      const initFormOperation = OpenAPI.instance.getOperation(initFormPath, initFormMethod)
      if (initFormOperation) {
        // 给 created 赋值
        tempState.created?.push({ 
          name: "flows/formPage/fetch",
          params: baseAction
        })
        // 给 title 进行赋值
        tempState.title = initFormOperation.summary || ''
        // 对 form 进行初始化操作
        const isResponses = initFormMethod.toLowerCase() === 'get' ? true : false
        const content = isResponses ? initFormOperation.responses[200].content : initFormOperation.requestBody.content 
        const schema = getSchemaByContent(content)
        const { form, forms, select } = generateDialogForm(schema)
        if (form) {
          if (!tempState.form) {
            tempState.form = { items: {}, inline: false }
          }
          tempState.form.items = form.items
        } else if (forms) {
          tempState.forms = forms
          tempState.select = select
        }
      }
    }

    return {
      data: this.inputs.data,
      state: tempState,
      baseAction: baseAction
    }
  }
}
