import { ReactFlowProvider } from "reactflow";
import { AppShell } from "../components/layout/AppShell";

export function App() {
  return (
    <ReactFlowProvider>
      <AppShell />
    </ReactFlowProvider>
  );
}
