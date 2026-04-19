import { useEffect } from "react";
import { WorkflowCanvas } from "../../features/workflow/canvas/WorkflowCanvas";
import { useAutomations } from "../../features/workflow/hooks/useAutomations";
import { useWorkflowStore } from "../../features/workflow/hooks/useWorkflowStore";
import { InspectorPanel } from "./InspectorPanel";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  const { error } = useAutomations();
  const validate = useWorkflowStore((state) => state.validate);

  useEffect(() => {
    validate();
  }, [validate]);

  return (
    <main className="app-shell">
      <Sidebar />
      <WorkflowCanvas />
      <InspectorPanel />
      {error ? <div className="toast">{error}</div> : null}
    </main>
  );
}
