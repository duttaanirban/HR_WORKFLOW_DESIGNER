import { FlaskConical, SlidersHorizontal } from "lucide-react";
import { NodeFormPanel } from "../../features/workflow/forms/NodeFormPanel";
import { useWorkflowStore } from "../../features/workflow/hooks/useWorkflowStore";
import { SandboxPanel } from "./SandboxPanel";

export function InspectorPanel() {
  const activePanel = useWorkflowStore((state) => state.activePanel);
  const setActivePanel = useWorkflowStore((state) => state.setActivePanel);

  return (
    <aside className="inspector">
      <div className="panel-tabs">
        <button
          type="button"
          className={activePanel === "inspector" ? "is-active" : ""}
          onClick={() => setActivePanel("inspector")}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Inspect
        </button>
        <button
          type="button"
          className={activePanel === "sandbox" ? "is-active" : ""}
          onClick={() => setActivePanel("sandbox")}
        >
          <FlaskConical size={16} aria-hidden="true" />
          Sandbox
        </button>
      </div>
      <div className="panel-body">{activePanel === "inspector" ? <NodeFormPanel /> : <SandboxPanel />}</div>
    </aside>
  );
}
