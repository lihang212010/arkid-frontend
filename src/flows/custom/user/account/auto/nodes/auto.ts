import { FunctionNode } from 'arkfbp/lib/functionNode'
import { AppModule } from '@/store/modules/app'

export class AutoFillNode extends FunctionNode {

  async run() {
    const { client } = this.inputs
    const { uuid, name } = AppModule.curApp
    const item = client.form.items.app.state
    item.options.push({
      value: uuid,
      label: name
    })
    item.value = uuid
  }

}