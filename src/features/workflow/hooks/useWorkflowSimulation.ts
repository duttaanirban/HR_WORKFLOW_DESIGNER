import { useMemo, useState } from "react";
import { simulateWorkflow } from "../../../services/api/simulation.api";
import type { SimulationResult, ValidationIssue } from "../types/workflow.types";
import { serializeWorkflow } from "../utils/serializeWorkflow";
import { validateWorkflow } from "../utils/validateWorkflow";
import { useWorkflowStore } from "./useWorkflowStore";

export function useWorkflowSimulation() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const automations = useWorkflowStore((state) => state.automations);
  const validate = useWorkflowStore((state) => state.validate);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const serializedWorkflow = useMemo(() => serializeWorkflow(nodes, edges), [nodes, edges]);

  async function runSimulation() {
    validate();
    const nextIssues = validateWorkflow(nodes, edges, automations);
    setIssues(nextIssues);

    if (nextIssues.some((issue) => issue.severity === "error")) {
      setResult(null);
      return;
    }

    setIsRunning(true);
    try {
      setResult(await simulateWorkflow(serializedWorkflow, automations));
    } finally {
      setIsRunning(false);
    }
  }

  return {
    serializedWorkflow,
    issues,
    result,
    isRunning,
    runSimulation,
  };
}
