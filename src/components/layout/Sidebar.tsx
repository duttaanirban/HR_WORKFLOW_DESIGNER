import { CheckCircle2, Eraser, GitPullRequest, Play, RotateCcw, UserCheck, Zap } from "lucide-react";
import { useWorkflowStore } from "../../features/workflow/hooks/useWorkflowStore";
import type { WorkflowNodeType } from "../../features/workflow/types/workflow.types";

const paletteItems: Array<{
  type: WorkflowNodeType;
  label: string;
  description: string;
  icon: typeof Play;
}> = [
  { type: "start", label: "Start", description: "Workflow entry point", icon: Play },
  { type: "task", label: "Task", description: "Human task or handoff", icon: GitPullRequest },
  { type: "approval", label: "Approval", description: "Manager or HR approval", icon: UserCheck },
  { type: "automation", label: "Automation", description: "System action", icon: Zap },
  { type: "end", label: "End", description: "Workflow completion", icon: CheckCircle2 },
];

export function Sidebar() {
  const clearWorkflow = useWorkflowStore((state) => state.clearWorkflow);
  const resetWorkflow = useWorkflowStore((state) => state.resetWorkflow);
  const validate = useWorkflowStore((state) => state.validate);

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">HR</div>
        <div>
          <h1>Workflow Designer</h1>
          <p>Build and test internal HR flows</p>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="section-label">Node palette</p>
        <div className="palette-list">
          {paletteItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                type="button"
                className={`palette-item palette-${item.type}`}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("application/workflow-node", item.type);
                  event.dataTransfer.effectAllowed = "move";
                }}
              >
                <span>
                  <Icon size={17} aria-hidden="true" />
                </span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sidebar-actions">
        <button type="button" className="secondary-button" onClick={validate}>
          Validate
        </button>
        <button type="button" className="ghost-button" onClick={clearWorkflow}>
          <Eraser size={16} aria-hidden="true" />
          Clear
        </button>
        <button type="button" className="ghost-button" onClick={resetWorkflow}>
          <RotateCcw size={16} aria-hidden="true" />
          Reset
        </button>
      </div>
    </aside>
  );
}
