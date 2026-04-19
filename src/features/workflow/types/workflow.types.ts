import type { Edge, Node } from "reactflow";

export type WorkflowNodeType = "start" | "task" | "approval" | "automation" | "end";

export type KeyValueMap = Record<string, string>;

type BaseWorkflowNodeData = {
  label: string;
  validationErrors?: string[];
};

export type StartNodeData = BaseWorkflowNodeData & {
  type: "start";
  title: string;
  metadata: KeyValueMap;
};

export type TaskNodeData = BaseWorkflowNodeData & {
  type: "task";
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValueMap;
};

export type ApprovalNodeData = BaseWorkflowNodeData & {
  type: "approval";
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
};

export type AutomationNodeData = BaseWorkflowNodeData & {
  type: "automation";
  title: string;
  actionId: string;
  params: KeyValueMap;
};

export type EndNodeData = BaseWorkflowNodeData & {
  type: "end";
  message: string;
  showSummary: boolean;
};

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomationNodeData
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>;
export type WorkflowEdge = Edge;

export type AutomationDefinition = {
  id: string;
  label: string;
  params: string[];
};

export type ValidationIssue = {
  nodeId?: string;
  edgeId?: string;
  severity: "error" | "warning";
  message: string;
};

export type SerializedWorkflow = {
  id: string;
  name: string;
  exportedAt: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export type SimulationStep = {
  id: string;
  status: "success" | "skipped" | "failed";
  title: string;
  detail: string;
};

export type SimulationResult = {
  runId: string;
  startedAt: string;
  completedAt: string;
  steps: SimulationStep[];
};
