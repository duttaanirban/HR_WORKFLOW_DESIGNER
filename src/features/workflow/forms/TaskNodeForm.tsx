import type { TaskNodeData } from "../types/workflow.types";
import { KeyValueEditor } from "./KeyValueEditor";

type Props = {
  data: TaskNodeData;
  onChange: (data: Partial<TaskNodeData>) => void;
};

export function TaskNodeForm({ data, onChange }: Props) {
  return (
    <>
      <label>
        Title
        <input required value={data.title} onChange={(event) => onChange({ title: event.target.value })} />
      </label>
      <label>
        Description
        <textarea value={data.description} onChange={(event) => onChange({ description: event.target.value })} />
      </label>
      <label>
        Assignee
        <input value={data.assignee} onChange={(event) => onChange({ assignee: event.target.value })} />
      </label>
      <label>
        Due date
        <input type="date" value={data.dueDate} onChange={(event) => onChange({ dueDate: event.target.value })} />
      </label>
      <KeyValueEditor
        label="Custom fields"
        value={data.customFields}
        onChange={(customFields) => onChange({ customFields })}
      />
    </>
  );
}
