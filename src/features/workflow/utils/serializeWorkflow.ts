import type { SerializedWorkflow, WorkflowEdge, WorkflowNode } from "../types/workflow.types";

export function serializeWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): SerializedWorkflow {
  return {
    id: "hr-workflow-prototype",
    name: "HR Workflow Designer Prototype",
    exportedAt: new Date().toISOString(),
    nodes,
    edges,
  };
}
