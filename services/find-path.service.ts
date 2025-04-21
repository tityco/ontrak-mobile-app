import { distance, findNearestPointOnEdges } from "@/_helper/helper";


class FindPathService {
  edges: any[] = [];

  initFinding = (paths: any[]) => {
    this.edges = [];
    paths.forEach(path => {
      this.edges.push({ x1: path.x1, x2: path.x2, y1: path.y1, y2: path.y2 })
    });
  }
  buildGraph = (edges: any[]): any => {
    let graph: any = {};
    edges.forEach(path => {
      const a = { x: path.x1, y: path.y1 };
      const b = { x: path.x2, y: path.y2 };
      const d = distance(a, b);

      const keyA = `${a.x},${a.y}`;
      const keyB = `${b.x},${b.y}`;

      if (!graph[keyA]) graph[keyA] = [];
      if (!graph[keyB]) graph[keyB] = [];

      graph[keyA].push({ node: keyB, cost: d });
      graph[keyB].push({ node: keyA, cost: d });

    });
    
    return graph
  }


  dijkstra = (graph: any, start: any, end: any): any[] => {
    const distances: { [key: string]: number } = {};
    const prev: { [key: string]: string | null } = {};
    const pq: Map<string, number> = new Map();

    const startKey = `${start.x},${start.y}`;
    const endKey = `${end.x},${end.y}`;

    for (let node in graph) {
      distances[node] = Infinity;
      prev[node] = null;
      pq.set(node, Infinity);
    }

    distances[startKey] = 0;
    pq.set(startKey, 0);

    while (pq.size > 0) {
      let [current] = [...pq.entries()].sort((a, b) => a[1] - b[1]);
      pq.delete(current[0]);

      if (current[0] === endKey) break;

      for (let neighbor of graph[current[0]]) {
        let alt = distances[current[0]] + neighbor.cost;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          prev[neighbor.node] = current[0];
          pq.set(neighbor.node, alt);
        }
      }
    }

    const path: string[] = [];
    let u: any = endKey;
    while (u) {
      path.unshift(u);
      u = prev[u];
    }

    return path.map(p => {
      const [x, y] = p.split(',').map(Number);
      return { x, y };
    });
  }

  addTempEdge = (from: any, to: any, graphWithExtra: any): any => {
    const fromKey = `${from.x},${from.y}`;
    const toKey = `${to.x},${to.y}`;
    const cost = distance(from, to);

    if (!graphWithExtra[fromKey]) graphWithExtra[fromKey] = [];
    if (!graphWithExtra[toKey]) graphWithExtra[toKey] = [];

    graphWithExtra[fromKey].push({ node: toKey, cost });
    graphWithExtra[toKey].push({ node: fromKey, cost });
    return graphWithExtra;
  }

  findFullPath(start: any, end: any): any[] {
    const graph = this.buildGraph(this.edges);

    const nearestStart = findNearestPointOnEdges(start, this.edges);

    const nearestEnd = findNearestPointOnEdges(end, this.edges);
    if (nearestStart.x == nearestEnd.x && nearestStart.y == nearestEnd.y) return [start, end];
    const pathBetween = this.dijkstra(graph, nearestStart, nearestEnd);

    return [start, nearestStart, ...pathBetween, nearestEnd, end];
  }
}

export default new FindPathService();