import { useMemo } from "react";
import type { AutomationDefinition, AutomationNodeData } from "../types/workflow.types";

type Props = {
  data: AutomationNodeData;
  automations: AutomationDefinition[];
  onChange: (data: Partial<AutomationNodeData>) => void;
};

export function AutomationNodeForm({ data, automations, onChange }: Props) {
  const selectedAutomation = useMemo(
    () => automations.find((automation) => automation.id === data.actionId) ?? automations[0],
    [automations, data.actionId],
  );

  function changeAction(actionId: string) {
    const action = automations.find((automation) => automation.id === actionId);
    onChange({
      actionId,
      params: Object.fromEntries((action?.params ?? []).map((param) => [param, data.params[param] ?? ""])),
    });
  }

  function updateParam(param: string, value: string) {
    onChange({ params: { ...data.params, [param]: value } });
  }

  return (
    <>
      <label>
        Title
        <input value={data.title} onChange={(event) => onChange({ title: event.target.value })} />
      </label>
      <label>
        Action
        <select value={data.actionId} onChange={(event) => changeAction(event.target.value)}>
          {automations.map((automation) => (
            <option key={automation.id} value={automation.id}>
              {automation.label}
            </option>
          ))}
        </select>
      </label>
      <div className="field-group">
        <p className="field-label">Action parameters</p>
        {selectedAutomation?.params.map((param) => (
          <label key={param}>
            {param}
            <input value={data.params[param] ?? ""} onChange={(event) => updateParam(param, event.target.value)} />
          </label>
        ))}
      </div>
    </>
  );
}
