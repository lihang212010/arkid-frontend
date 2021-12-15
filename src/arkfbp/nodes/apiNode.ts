import { FunctionNode } from 'arkfbp/lib/functionNode'
import http from '@/login/http'
import { Method, ResponseType, AxiosRequestConfig } from 'axios'

export class APINode extends FunctionNode {

  url: string = ''
  method = 'GET'
  params: any = null
  headers: any = null
  responseType = 'json'

  private options: AxiosRequestConfig = {
    url: '',
    method: 'GET',
    params: null,
    data: null,
    headers: null
  }

  initOptions() {
    this.options = {
      url: this.url,
      method: this.method as Method,
      headers: this.headers,
      responseType: this.responseType as ResponseType,
    }
    if (this.method.toUpperCase() === 'GET') {
      this.options.params = this.params
    } else {
      this.options.data = this.params
    }
  }

  async run() {
    this.initOptions()
    const res = await http(this.options)
    return res.data
  }

}
