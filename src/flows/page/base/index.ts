import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { PageCreateNode } from './nodes/create'
import { PageStateNode } from './nodes/state'
import { PageActionNode } from './nodes/action'

export class Main extends Flow {
  createNodes() {
    return [
      {
        cls: StartNode,
        id: 'start',
        next: 'page-create'
      }, {
        cls: PageCreateNode,
        id: 'page-create',
        next: 'page-state'
      }, {
        cls: PageStateNode,
        id: 'page-state',
        next: 'page-action'
      }, {
        cls: PageActionNode,
        id: 'page-action',
        next: 'stop'
      }, {
        cls: StopNode,
        id: 'stop'
      }
    ]
  }

  createGraph() {
    const g = new Graph()
    g.nodes = this.createNodes()
    return g
  }
}
