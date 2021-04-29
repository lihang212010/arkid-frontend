import { runWorkflowByClass } from 'arkfbp/lib/flow'
import getPageState from '@/utils/get-page-state'
import { cloneDeep } from "lodash"
import Filter from '@/utils/filter'
import getUrl from '@/utils/url'

export interface FlowConfig {
  name: string
  url?: string
  method?: string
  request?: FlowConfigResponseOrRequest
  response?: FlowConfigResponseOrRequest
}

export interface FlowConfigResponseOrRequest {
  [key: string]: string | number | boolean | undefined
}

// 根据某个按钮处的 action 配置项（字符串或函数格式--函数格式在BaseVue.ts中直接执行）
// 查找当前 page-state 的 actions 中的以 actionName 为 key 的配置项内容
// 并逐一执行其中的各个流内容
export async function runFlowByActionName(com: Vue, actionName: string) {
  const currentPageState = getPageState()
  if (!currentPageState?.actions) {  
    return
  }
  const currentFlows: (FlowConfig | string)[] = currentPageState.actions[actionName]
  if (currentFlows?.length) {
    for (let i = 0; i < currentFlows.length; i++) {
      if (typeof currentFlows[i] === 'string') {
        await runFlowByActionName(com, currentFlows[i] as string)
      } else {
        await runFlow(com, currentPageState, currentFlows[i] as FlowConfig)
      }
    }
  }
}

// 通过该函数去调用 runFlowByFile -- 解析 request 的参数信息
export async function runFlow (com: Vue, state: any, flow: FlowConfig) {
  const { name: filePath, ...args } = flow
  const inputs = {
    url: args.url ? getUrl(args.url) : '',
    method: args.method?.toUpperCase(),
    params: {},
    client: state,
    clientServer: args.response,
    com: com
  }
  // 对 request 请求参数进行解析处理
  if (args.request) {
    const mapping = stateMappingProxy(state, args.request)
    inputs.params = parseStateMapping(state, mapping)
  }
  await runFlowByFile(filePath, inputs)
}

// 使用 arkfbp-javascript 执行配置中的流内容 
// arkfbp-javascript: https://github.com/longguikeji/arkfbp-javascript
export async function runFlowByFile(flowPath: string, inputs: any) {
  if (!flowPath) {
    return
  }
  if (/^(@\/)/.test(flowPath)) {
    flowPath = flowPath.slice(2)
  }
  const flow = await import(`@/${flowPath}`)
  const outputs = await runWorkflowByClass(flow.Main, inputs)
  return outputs
}

// 对Mapping进行一次二次处理
export function stateMappingProxy(state: any, mapping: FlowConfigResponseOrRequest) {
  Object.keys(mapping).forEach(key => {
    const m = mapping[key]
    let selectItemsObject = {}
    if (typeof m === 'object') {
      const selectValMapping = m['value']
      const val = getStateByStringConfig(state, selectValMapping)
      selectItemsObject = m[val]
      selectItemsObject[key] = selectValMapping
      mapping[key] = undefined
      Object.assign(mapping, selectItemsObject)
    }
  })
  return mapping
}

// 对配置项中的 request 或者 response 进行配置解析
// 参数说明
// state: current page state
// mapping: request or response config
export function parseStateMapping(state: any, mapping: FlowConfigResponseOrRequest) {
  let params = {}
  Object.keys(mapping).forEach(key => {
    let tempState
    const item = mapping[key]
    if (typeof item === 'string') {
      tempState = getStateByStringConfig(state, item)
      params[key] = tempState
    } else if (typeof item === 'object') {
      const objectData = parseStateMapping(state, item)
      params[key] = { ...objectData }
    } else {
      params[key] = tempState
    }
  })
  return params
}

export function getStateByStringConfig(state: any, str: string) {
  let tempState = cloneDeep(state)
  if (str.includes('forms[')) {
    const newStr = str.slice(str.indexOf('[') + 1, str.indexOf(']'))
    const value = getStateByStringConfig(state, newStr)
    str = str.slice(0, str.indexOf('[')) + '.' + value + str.slice(str.indexOf(']') + 1)
  }
  const strMapping = str.split('.')
  if (strMapping.length) {
    strMapping.forEach(sm => {
      if (sm.includes('columns[prop=')) {
        const res = Filter(sm, tempState)
        tempState = tempState.cloumns[res]
      } else {
        tempState = tempState[sm]
      }
    })
  }
  return tempState
}
