import { FunctionNode } from 'arkfbp/lib/functionNode'

export class JumperNode extends FunctionNode {
  async run() {
    const { target, com } = this.inputs
    if (!target) return
    com.$router.push({
      path: target,
      query: com.$route.query,
    })
  }
}
