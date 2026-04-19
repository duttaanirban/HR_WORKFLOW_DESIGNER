import { Download, Play, Upload } from "lucide-react";
import { useRef } from "react";
import { useWorkflowSimulation } from "../../features/workflow/hooks/useWorkflowSimulation";
import { useWorkflowStore } from "../../features/workflow/hooks/useWorkflowStore";
import type { SerializedWorkflow } from "../../features/workflow/types/workflow.types";

export function SandboxPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const loadWorkflow = useWorkflowStore((state) => state.loadWorkflow);
  const { serializedWorkflow, issues, result, isRunning, runSimulation } = useWorkflowSimulation();
  const blockingErrors = issues.filter((issue) => issue.severity === "error");

  function exportWorkflow() {
    const blob = new Blob([JSON.stringify(serializedWorkflow, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "hr-workflow.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function importWorkflow(file: File | undefined) {
    if (!file) {
      return;
    }
    const text = await file.text();
    loadWorkflow(JSON.parse(text) as SerializedWorkflow);
  }

  return (
    <div className="sandbox-panel">
      <div>
        <p className="panel-eyebrow">Workflow test</p>
        <h2>Sandbox</h2>
      </div>

      <div className="sandbox-actions">
        <button type="button" className="primary-button" onClick={runSimulation} disabled={isRunning}>
          <Play size={16} aria-hidden="true" />
          {isRunning ? "Running" : "Run"}
        </button>
        <button type="button" className="secondary-button" onClick={exportWorkflow}>
          <Download size={16} aria-hidden="true" />
          Export
        </button>
        <button type="button" className="ghost-button" onClick={() => inputRef.current?.click()}>
          <Upload size={16} aria-hidden="true" />
          Import
        </button>
        <input
          ref={inputRef}
          hidden
          type="file"
          accept="application/json"
          onChange={(event) => importWorkflow(event.target.files?.[0])}
        />
      </div>

      {issues.length > 0 ? (
        <section className="issue-list">
          <strong>{blockingErrors.length ? "Fix before simulation" : "Warnings"}</strong>
          {issues.map((issue) => (
            <p key={`${issue.nodeId ?? "workflow"}-${issue.message}`} className={issue.severity}>
              {issue.message}
            </p>
          ))}
        </section>
      ) : null}

      {result ? (
        <section className="timeline">
          <div className="run-meta">
            <strong>{result.runId}</strong>
            <span>{new Date(result.completedAt).toLocaleTimeString()}</span>
          </div>
          {result.steps.map((step) => (
            <article key={step.id} className={`timeline-step ${step.status}`}>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
            </article>
          ))}
        </section>
      ) : (
        <div className="empty-state compact">
          <strong>No simulation yet</strong>
          <p>Run the workflow to validate the graph and produce an execution log.</p>
        </div>
      )}

      <section className="json-preview">
        <div className="field-row">
          <strong>Serialized workflow</strong>
          <span>{serializedWorkflow.nodes.length} nodes</span>
        </div>
        <pre>{JSON.stringify(serializedWorkflow, null, 2)}</pre>
      </section>
    </div>
  );
}
