import { AlertTriangle } from "lucide-react";
import { useWorkflowStore } from "../hooks/useWorkflowStore";
import type { WorkflowNodeData } from "../types/workflow.types";
import { ApprovalNodeForm } from "./ApprovalNodeForm";
import { AutomationNodeForm } from "./AutomationNodeForm";
import { EndNodeForm } from "./EndNodeForm";
import { StartNodeForm } from "./StartNodeForm";
import { TaskNodeForm } from "./TaskNodeForm";

export function NodeFormPanel() {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const node = useWorkflowStore((state) => state.nodes.find((item) => item.id === selectedNodeId));
  const automations = useWorkflowStore((state) => state.automations);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  if (!node) {
    return (
      <div className="empty-state">
        <strong>Select a node</strong>
        <p>Use the canvas to select a workflow step and edit its configuration here.</p>
      </div>
    );
  }

  const onChange = (data: Partial<WorkflowNodeData>) => updateNodeData(node.id, data);

  return (
    <form className="node-form" onSubmit={(event) => event.preventDefault()}>
      <div>
        <p className="panel-eyebrow">{node.data.label}</p>
        <h2>Configure node</h2>
      </div>

      {node.data.validationErrors?.length ? (
        <div className="validation-callout">
          <AlertTriangle size={16} aria-hidden="true" />
          <div>
            {node.data.validationErrors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        </div>
      ) : null}

      {node.data.type === "start" ? <StartNodeForm data={node.data} onChange={onChange} /> : null}
      {node.data.type === "task" ? <TaskNodeForm data={node.data} onChange={onChange} /> : null}
      {node.data.type === "approval" ? <ApprovalNodeForm data={node.data} onChange={onChange} /> : null}
      {node.data.type === "automation" ? (
        <AutomationNodeForm data={node.data} automations={automations} onChange={onChange} />
      ) : null}
      {node.data.type === "end" ? <EndNodeForm data={node.data} onChange={onChange} /> : null}
    </form>
  );
}
