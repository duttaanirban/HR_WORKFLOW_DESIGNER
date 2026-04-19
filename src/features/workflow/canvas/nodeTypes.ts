import type { NodeTypes } from "reactflow";
import { WorkflowNodeCard } from "../nodes/WorkflowNodeCard";

export const nodeTypes: NodeTypes = {
  start: WorkflowNodeCard,
  task: WorkflowNodeCard,
  approval: WorkflowNodeCard,
  automation: WorkflowNodeCard,
  end: WorkflowNodeCard,
};
