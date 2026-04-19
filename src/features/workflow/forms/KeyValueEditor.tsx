import { Plus, X } from "lucide-react";
import type { KeyValueMap } from "../types/workflow.types";

type KeyValueEditorProps = {
  label: string;
  value: KeyValueMap;
  onChange: (value: KeyValueMap) => void;
};

export function KeyValueEditor({ label, value, onChange }: KeyValueEditorProps) {
  const entries = Object.entries(value);

  function updateKey(oldKey: string, nextKey: string) {
    const nextEntries = entries.map(([key, entryValue]) => [key === oldKey ? nextKey : key, entryValue]);
    onChange(Object.fromEntries(nextEntries));
  }

  function updateValue(key: string, nextValue: string) {
    onChange({ ...value, [key]: nextValue });
  }

  function removeKey(key: string) {
    const next = { ...value };
    delete next[key];
    onChange(next);
  }

  function addPair() {
    const key = uniqueKey(value);
    onChange({ ...value, [key]: "" });
  }

  return (
    <div className="field-group">
      <div className="field-row">
        <label>{label}</label>
        <button type="button" className="inline-icon-button" onClick={addPair} title={`Add ${label}`}>
          <Plus size={15} aria-hidden="true" />
        </button>
      </div>
      {entries.length === 0 ? <p className="muted">No custom pairs added.</p> : null}
      {entries.map(([key, entryValue]) => (
        <div className="kv-row" key={key}>
          <input aria-label={`${label} key`} value={key} onChange={(event) => updateKey(key, event.target.value)} />
          <input
            aria-label={`${label} value`}
            value={entryValue}
            onChange={(event) => updateValue(key, event.target.value)}
          />
          <button type="button" className="inline-icon-button" onClick={() => removeKey(key)} title="Remove pair">
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}

function uniqueKey(value: KeyValueMap) {
  let index = Object.keys(value).length + 1;
  let key = `field_${index}`;
  while (Object.prototype.hasOwnProperty.call(value, key)) {
    index += 1;
    key = `field_${index}`;
  }
  return key;
}
