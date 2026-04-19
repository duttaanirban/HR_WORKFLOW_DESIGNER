import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  type NodeMouseHandler,
  type OnSelectionChangeParams,
  useReactFlow,
} from "reactflow";
import { Trash2 } from "lucide-react";
import { useWorkflowStore } from "../hooks/useWorkflowStore";
import type { WorkflowNodeType } from "../types/workflow.types";
import { nodeTypes } from "./nodeTypes";

export function WorkflowCanvas() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange);
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange);
  const onConnect = useWorkflowStore((state) => state.onConnect);
  const addNode = useWorkflowStore((state) => state.addNode);
  const selectNode = useWorkflowStore((state) => state.selectNode);
  const deleteSelected = useWorkflowStore((state) => state.deleteSelected);
  const setActivePanel = useWorkflowStore((state) => state.setActivePanel);
  const { screenToFlowPosition, fitView } = useReactFlow();

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/workflow-node") as WorkflowNodeType;
      if (!type) {
        return;
      }

      addNode(
        type,
        screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        }),
      );
    },
    [addNode, screenToFlowPosition],
  );

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    selectNode(node.id);
  };

  const handlePaneClick = () => {
    selectNode(null);
  };

  const handleSelectionChange = ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
    if (selectedNodes.length === 1) {
      selectNode(selectedNodes[0].id);
    }
  };

  return (
    <section className="canvas-shell" aria-label="Workflow canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onSelectionChange={handleSelectionChange}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        }}
        onDrop={handleDrop}
        fitView
        fitViewOptions={{ padding: 0.24 }}
        deleteKeyCode={["Backspace", "Delete"]}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#cbd5e1" gap={22} size={1} />
        <Controls position="bottom-left" />
        <MiniMap pannable zoomable nodeStrokeWidth={3} position="bottom-right" />
        <Panel position="top-left" className="canvas-toolbar">
          <button type="button" className="icon-button" onClick={() => fitView({ padding: 0.25 })} title="Fit view">
            Fit
          </button>
          <button type="button" className="icon-button danger" onClick={deleteSelected} title="Delete selected">
            <Trash2 size={16} aria-hidden="true" />
          </button>
          <button type="button" className="text-button" onClick={() => setActivePanel("sandbox")}>
            Test workflow
          </button>
        </Panel>
      </ReactFlow>
    </section>
  );
}
