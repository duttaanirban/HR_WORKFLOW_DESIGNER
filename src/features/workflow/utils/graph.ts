import type { WorkflowEdge, WorkflowNode } from "../types/workflow.types";

export function getOutgoing(nodeId: string, edges: WorkflowEdge[]) {
  return edges.filter((edge) => edge.source === nodeId).map((edge) => edge.target);
}

export function getIncoming(nodeId: string, edges: WorkflowEdge[]) {
  return edges.filter((edge) => edge.target === nodeId).map((edge) => edge.source);
}

export function findReachableNodeIds(startId: string, edges: WorkflowEdge[]) {
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    adjacency.set(edge.source, [...(adjacency.get(edge.source) ?? []), edge.target]);
  }

  const visited = new Set<string>();
  const stack = [startId];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || visited.has(current)) {
      continue;
    }
    visited.add(current);
    for (const next of adjacency.get(current) ?? []) {
      stack.push(next);
    }
  }

  return visited;
}

export function hasCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) {
    adjacency.set(node.id, []);
  }
  for (const edge of edges) {
    adjacency.set(edge.source, [...(adjacency.get(edge.source) ?? []), edge.target]);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(nodeId: string): boolean {
    if (visiting.has(nodeId)) {
      return true;
    }
    if (visited.has(nodeId)) {
      return false;
    }

    visiting.add(nodeId);
    for (const child of adjacency.get(nodeId) ?? []) {
      if (visit(child)) {
        return true;
      }
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  }

  return nodes.some((node) => visit(node.id));
}

export function topologicalWalk(startId: string, nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const result: WorkflowNode[] = [];
  const visited = new Set<string>();
  const queue = [startId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId || visited.has(currentId)) {
      continue;
    }

    const node = byId.get(currentId);
    if (!node) {
      continue;
    }

    visited.add(currentId);
    result.push(node);
    queue.push(...getOutgoing(currentId, edges));
  }

  return result;
}
