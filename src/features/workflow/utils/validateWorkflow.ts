import type {
  AutomationDefinition,
  ValidationIssue,
  WorkflowEdge,
  WorkflowNode,
} from "../types/workflow.types";
import { findReachableNodeIds, getIncoming, getOutgoing, hasCycle } from "./graph";

export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  automations: AutomationDefinition[] = [],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const startNodes = nodes.filter((node) => node.data.type === "start");
  const endNodes = nodes.filter((node) => node.data.type === "end");

  if (nodes.length === 0) {
    return [{ severity: "error", message: "Add at least one Start node and one End node." }];
  }

  if (startNodes.length !== 1) {
    issues.push({
      severity: "error",
      message: `Workflow must have exactly one Start node. Found ${startNodes.length}.`,
    });
  }

  if (endNodes.length < 1) {
    issues.push({ severity: "error", message: "Workflow must include at least one End node." });
  }

  for (const node of nodes) {
    const incoming = getIncoming(node.id, edges);
    const outgoing = getOutgoing(node.id, edges);

    if (node.data.type === "start" && incoming.length > 0) {
      issues.push({
        nodeId: node.id,
        severity: "error",
        message: "Start node cannot have incoming connections.",
      });
    }

    if (node.data.type === "start" && outgoing.length === 0) {
      issues.push({
        nodeId: node.id,
        severity: "error",
        message: "Start node must connect to the next step.",
      });
    }

    if (node.data.type === "end" && outgoing.length > 0) {
      issues.push({
        nodeId: node.id,
        severity: "error",
        message: "End node cannot have outgoing connections.",
      });
    }

    if (node.data.type !== "start" && incoming.length === 0) {
      issues.push({
        nodeId: node.id,
        severity: "error",
        message: `${node.data.label} node is missing an incoming connection.`,
      });
    }

    if (node.data.type !== "end" && outgoing.length === 0) {
      issues.push({
        nodeId: node.id,
        severity: "warning",
        message: `${node.data.label} node has no outgoing connection.`,
      });
    }

    if ((node.data.type === "start" || node.data.type === "task" || node.data.type === "approval" || node.data.type === "automation") && !node.data.title.trim()) {
      issues.push({
        nodeId: node.id,
        severity: "error",
        message: `${node.data.label} title is required.`,
      });
    }

    if (node.data.type === "task" && !node.data.assignee.trim()) {
      issues.push({
        nodeId: node.id,
        severity: "error",
        message: "Task node requires an assignee.",
      });
    }

    if (node.data.type === "approval" && !node.data.approverRole.trim()) {
      issues.push({
        nodeId: node.id,
        severity: "error",
        message: "Approval node requires an approver role.",
      });
    }

    if (node.data.type === "automation") {
      const data = node.data;
      const action = automations.find((automation) => automation.id === data.actionId);
      if (!action) {
        issues.push({
          nodeId: node.id,
          severity: "error",
          message: "Automation node must use a valid action.",
        });
      } else {
        for (const param of action.params) {
          if (!data.params[param]?.trim()) {
            issues.push({
              nodeId: node.id,
              severity: "error",
              message: `Automation parameter "${param}" is required.`,
            });
          }
        }
      }
    }

    if (node.data.type === "end" && !node.data.message.trim()) {
      issues.push({
        nodeId: node.id,
        severity: "error",
        message: "End node requires a completion message.",
      });
    }
  }

  if (startNodes.length === 1) {
    const reachable = findReachableNodeIds(startNodes[0].id, edges);
    for (const node of nodes) {
      if (!reachable.has(node.id)) {
        issues.push({
          nodeId: node.id,
          severity: "error",
          message: `${node.data.label} node is not reachable from Start.`,
        });
      }
    }
  }

  if (hasCycle(nodes, edges)) {
    issues.push({
      severity: "error",
      message: "Workflow contains a cycle. Remove looping connections before simulation.",
    });
  }

  return issues;
}

export function applyValidationToNodes(nodes: WorkflowNode[], issues: ValidationIssue[]) {
  const byNode = new Map<string, string[]>();
  for (const issue of issues) {
    if (!issue.nodeId) {
      continue;
    }
    byNode.set(issue.nodeId, [...(byNode.get(issue.nodeId) ?? []), issue.message]);
  }

  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      validationErrors: byNode.get(node.id) ?? [],
    },
  }));
}
