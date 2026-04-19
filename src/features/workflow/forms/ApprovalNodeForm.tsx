import type { ApprovalNodeData } from "../types/workflow.types";

type Props = {
  data: ApprovalNodeData;
  onChange: (data: Partial<ApprovalNodeData>) => void;
};

export function ApprovalNodeForm({ data, onChange }: Props) {
  return (
    <>
      <label>
        Title
        <input value={data.title} onChange={(event) => onChange({ title: event.target.value })} />
      </label>
      <label>
        Approver role
        <select value={data.approverRole} onChange={(event) => onChange({ approverRole: event.target.value })}>
          <option>Manager</option>
          <option>HRBP</option>
          <option>Director</option>
          <option>Finance</option>
          <option>Legal</option>
        </select>
      </label>
      <label>
        Auto-approve threshold
        <input
          type="number"
          min="0"
          value={data.autoApproveThreshold}
          onChange={(event) => onChange({ autoApproveThreshold: Number(event.target.value) })}
        />
      </label>
    </>
  );
}
