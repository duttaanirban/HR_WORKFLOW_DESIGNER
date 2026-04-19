import type { StartNodeData } from "../types/workflow.types";
import { KeyValueEditor } from "./KeyValueEditor";

type Props = {
  data: StartNodeData;
  onChange: (data: Partial<StartNodeData>) => void;
};

export function StartNodeForm({ data, onChange }: Props) {
  return (
    <>
      <label>
        Start title
        <input value={data.title} onChange={(event) => onChange({ title: event.target.value })} />
      </label>
      <KeyValueEditor label="Metadata" value={data.metadata} onChange={(metadata) => onChange({ metadata })} />
    </>
  );
}
