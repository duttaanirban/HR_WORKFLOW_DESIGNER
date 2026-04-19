import { Handle, Position, type NodeProps } from "reactflow";
import { AlertCircle, CheckCircle2, GitPullRequest, Play, Settings, UserCheck, Zap } from "lucide-react";
import type { WorkflowNodeData, WorkflowNodeType } from "../types/workflow.types";
import { getNodeDisplayTitle } from "../utils/nodeFactory";

const nodeMeta: Record<WorkflowNodeType, { icon: typeof Play; className: string; eyebrow: string }> = {
  start: { icon: Play, className: "node-start", eyebrow: "Entry" },
  task: { icon: GitPullRequest, className: "node-task", eyebrow: "Human task" },
  approval: { icon: UserCheck, className: "node-approval", eyebrow: "Decision" },
  automation: { icon: Zap, className: "node-automation", eyebrow: "System" },
  end: { icon: CheckCircle2, className: "node-end", eyebrow: "Completion" },
};

export function WorkflowNodeCard({ data, selected }: NodeProps<WorkflowNodeData>) {
  const meta = nodeMeta[data.type];
  const Icon = meta.icon;
  const hasErrors = Boolean(data.validationErrors?.length);

  return (
    <div className={`workflow-node ${meta.className} ${selected ? "is-selected" : ""} ${hasErrors ? "has-errors" : ""}`}>
      {data.type !== "start" ? <Handle type="target" position={Position.Left} /> : null}
      <div className="workflow-node__header">
        <span className="workflow-node__icon">
          <Icon size={16} aria-hidden="true" />
        </span>
        <span>{meta.eyebrow}</span>
      </div>
      <strong>{getNodeDisplayTitle(data)}</strong>
      <p>{nodeSubtitle(data)}</p>
      {hasErrors ? (
        <div className="workflow-node__error">
          <AlertCircle size={14} aria-hidden="true" />
          {data.validationErrors?.[0]}
        </div>
      ) : (
        <div className="workflow-node__ready">
          <Settings size={14} aria-hidden="true" />
          Configured
        </div>
      )}
      {data.type !== "end" ? <Handle type="source" position={Position.Right} /> : null}
    </div>
  );
}

function nodeSubtitle(data: WorkflowNodeData) {
  switch (data.type) {
    case "start":
      return `${Object.keys(data.metadata).length} metadata field(s)`;
    case "task":
      return data.assignee ? `Assigned to ${data.assignee}` : "Assignee missing";
    case "approval":
      return `Approver: ${data.approverRole || "Not set"}`;
    case "automation":
      return data.actionId ? `Action: ${data.actionId}` : "Action missing";
    case "end":
      return data.showSummary ? "Generates final summary" : "No summary";
  }
}
