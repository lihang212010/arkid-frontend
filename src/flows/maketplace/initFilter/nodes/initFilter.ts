import { AuthApiNode } from '@/nodes/authApiNode'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitFilter extends AuthApiNode {
  async run() {
    const tempState = this.inputs.state as TablePageState
    const initContent = this.inputs.initContent

    // filter element info
    this.url = '/api/v1/tags/'
    this.method = 'GET'
    const outputs = await super.run()
    const tagOptions = outputs.data.map(tag => {return { value: tag }})
    const typeOptions = [
      { value: 'global' },
      { value: 'tenant' }
    ]
    
    tempState.filter = {
      inline: true,
      size: 'mini',
      items: {
        tags: {
          label: '标签',
          type: 'Select',
          isSetWidth: false,
          state: {
            value: '',
            options: tagOptions,
            multiple: true
          }
        },
        type: {
          label: '类型',
          type: 'Select',
          isSetWidth: false,
          state: {
            value: '',
            options: typeOptions,
            multiple: true
          }
        },
        scope: {
          label: '作用域',
          type: 'Select',
          isSetWidth: false,
          state: {
            value: '',
            options: typeOptions,
            multiple: true
          }
        },
        action: {
          type: 'Button',
          isSetWidth: false,
          state: {
            label: '搜索',
            type: 'primary',
            action: [
              {
                name: 'flows/tablePage/fetch',
                params: {
                  fetchUrl: initContent.init.path,
                  fetchMethod: initContent.init.method,
                  isFilter: true
                }
              }
            ]
          }
        }
      }
    }
    
    return {
      data: this.inputs.data,
      state: tempState
    }
  }
}
