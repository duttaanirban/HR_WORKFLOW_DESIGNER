import { useEffect, useState } from "react";
import { getAutomations } from "../../../services/api/automations.api";
import type { AutomationDefinition } from "../types/workflow.types";
import { useWorkflowStore } from "./useWorkflowStore";

export function useAutomations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const automations = useWorkflowStore((state) => state.automations);
  const setAutomations = useWorkflowStore((state) => state.setAutomations);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getAutomations()
      .then((data: AutomationDefinition[]) => {
        if (isMounted) {
          setAutomations(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Could not load automation actions.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [setAutomations]);

  return { automations, isLoading, error };
}
