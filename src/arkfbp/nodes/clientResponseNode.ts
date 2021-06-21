import { FunctionNode } from 'arkfbp/lib/functionNode'
import stateFilter from '@/utils/state-filter'

export class ClientResponseNode extends FunctionNode {
  async run() {
    // 客户端进行响应的必要内容说明
    // client 代表当前页面的 state
    // clientServer 代表需要进行响应的数据映射关系
    // data 代表刚刚请求的返回的数据内容 -- fetch和update时使用
    // type 代表为那种响应类型
    const { client, clientServer } = this.$state.fetch()
    let data = this.inputs
    if (!data) {
      return null
    }
    const type = this.$state.fetch().type
    // start to change
    if (clientServer && client) {
      Object.keys(clientServer).forEach((key) => {
        const ks = key.split('.')
        const len = ks.length
        let temp = client
        for (let i = 0; i < len - 1; i++) {
          if (!temp) break
          const k = ks[i]
          if (k.includes('[')) {
            const idx = k.indexOf('[')
            const firstKey = k.substring(0, idx)
            const secondKey = stateFilter(k, temp)
            temp = temp[firstKey][secondKey]
          } else {
            temp = temp[k]
          }
        }
        // 判断此时的类型内容 -- 之后需要进一步增大兼容性
        
        if (temp) {
          const lastKey = ks[len - 1]
          if (type === 'fetch') {
            const vs = clientServer[key].split('.')
            let tempS = data
            for (let i = 0; i < vs.length - 1; i++) {
              if (!tempS) break
              tempS = tempS[vs[i]]
            }
            let res = tempS ? tempS[vs[vs.length - 1]] : undefined
            if (res === undefined) { 
              if (lastKey !== 'value') {
                res = clientServer[key]
              }
              if (lastKey === 'data') {
                res = tempS
              }
            }
            if (lastKey === 'disabled') {
              temp[lastKey] = res ? false : true
            } else {
              temp[lastKey] = res
            }
          } else if (type === 'assign') {
            temp[lastKey] = temp?.default || clientServer[key]
          }
        }
      })
    }
    return this.inputs
  }
}
