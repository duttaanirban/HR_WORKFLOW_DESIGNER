import type {
  AutomationDefinition,
  SerializedWorkflow,
  SimulationResult,
  SimulationStep,
  WorkflowNode,
} from "../../features/workflow/types/workflow.types";
import { topologicalWalk } from "../../features/workflow/utils/graph";

export async function simulateWorkflow(
  workflow: SerializedWorkflow,
  automations: AutomationDefinition[],
): Promise<SimulationResult> {
  await delay(450);

  const start = workflow.nodes.find((node) => node.data.type === "start");
  const orderedNodes = start ? topologicalWalk(start.id, workflow.nodes, workflow.edges) : workflow.nodes;
  const steps = orderedNodes.map((node, index) => nodeToSimulationStep(node, index, automations));
  const now = new Date();

  return {
    runId: `SIM-${Math.floor(Math.random() * 90000) + 10000}`,
    startedAt: now.toISOString(),
    completedAt: new Date(now.getTime() + steps.length * 180).toISOString(),
    steps,
  };
}

function nodeToSimulationStep(
  node: WorkflowNode,
  index: number,
  automations: AutomationDefinition[],
): SimulationStep {
  const sequence = `${index + 1}.`;

  switch (node.data.type) {
    case "start":
      return {
        id: node.id,
        status: "success",
        title: `${sequence} Started: ${node.data.title}`,
        detail: metadataDetail(node.data.metadata),
      };
    case "task":
      return {
        id: node.id,
        status: "success",
        title: `${sequence} Task assigned: ${node.data.title}`,
        detail: `Assignee: ${node.data.assignee}${node.data.dueDate ? `, due ${node.data.dueDate}` : ""}`,
      };
    case "approval":
      return {
        id: node.id,
        status: "success",
        title: `${sequence} Approval requested: ${node.data.title}`,
        detail: `${node.data.approverRole} reviews the request. Auto-approve threshold: ${node.data.autoApproveThreshold}.`,
      };
    case "automation": {
      const data = node.data;
      const action = automations.find((automation) => automation.id === data.actionId);
      return {
        id: node.id,
        status: "success",
        title: `${sequence} Automation executed: ${action?.label ?? data.actionId}`,
        detail: Object.entries(data.params)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", "),
      };
    }
    case "end":
      return {
        id: node.id,
        status: "success",
        title: `${sequence} Completed`,
        detail: `${node.data.message}${node.data.showSummary ? " Summary generated." : ""}`,
      };
  }
}

function metadataDetail(metadata: Record<string, string>) {
  const entries = Object.entries(metadata);
  if (entries.length === 0) {
    return "No metadata provided.";
  }
  return entries.map(([key, value]) => `${key}: ${value}`).join(", ");
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
