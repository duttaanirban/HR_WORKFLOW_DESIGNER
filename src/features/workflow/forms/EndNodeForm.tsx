import type { EndNodeData } from "../types/workflow.types";

type Props = {
  data: EndNodeData;
  onChange: (data: Partial<EndNodeData>) => void;
};

export function EndNodeForm({ data, onChange }: Props) {
  return (
    <>
      <label>
        End message
        <textarea value={data.message} onChange={(event) => onChange({ message: event.target.value })} />
      </label>
      <label className="toggle-field">
        <input
          type="checkbox"
          checked={data.showSummary}
          onChange={(event) => onChange({ showSummary: event.target.checked })}
        />
        <span>Generate summary</span>
      </label>
    </>
  );
}
