import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type XYPosition,
} from "reactflow";
import type {
  AutomationDefinition,
  SerializedWorkflow,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeData,
  WorkflowNodeType,
} from "../types/workflow.types";
import { createNodeData } from "../utils/nodeFactory";
import { applyValidationToNodes, validateWorkflow } from "../utils/validateWorkflow";

const initialNodes: WorkflowNode[] = [
  {
    id: "start-1",
    type: "start",
    position: { x: 120, y: 160 },
    data: createNodeData("start"),
  },
  {
    id: "task-1",
    type: "task",
    position: { x: 410, y: 130 },
    data: createNodeData("task"),
  },
  {
    id: "approval-1",
    type: "approval",
    position: { x: 700, y: 130 },
    data: createNodeData("approval"),
  },
  {
    id: "automation-1",
    type: "automation",
    position: { x: 990, y: 130 },
    data: createNodeData("automation"),
  },
  {
    id: "end-1",
    type: "end",
    position: { x: 1280, y: 160 },
    data: createNodeData("end"),
  },
];

const initialEdges: WorkflowEdge[] = [
  createEdge("start-1", "task-1"),
  createEdge("task-1", "approval-1"),
  createEdge("approval-1", "automation-1"),
  createEdge("automation-1", "end-1"),
];

type WorkflowStore = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  activePanel: "inspector" | "sandbox";
  automations: AutomationDefinition[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: WorkflowNodeType, position: XYPosition) => void;
  selectNode: (nodeId: string | null) => void;
  updateNodeData: <T extends WorkflowNodeData>(nodeId: string, data: Partial<T>) => void;
  deleteSelected: () => void;
  setAutomations: (automations: AutomationDefinition[]) => void;
  validate: () => void;
  resetWorkflow: () => void;
  loadWorkflow: (workflow: SerializedWorkflow) => void;
  setActivePanel: (panel: "inspector" | "sandbox") => void;
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  activePanel: "inspector",
  automations: [],

  onNodesChange: (changes) => {
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[] }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
  },

  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
          type: "smoothstep",
          animated: true,
          style: { strokeWidth: 2 },
        },
        state.edges,
      ),
    }));
    window.setTimeout(() => get().validate(), 0);
  },

  addNode: (type, position) => {
    const node: WorkflowNode = {
      id: `${type}-${crypto.randomUUID()}`,
      type,
      position,
      data: createNodeData(type),
    };

    set((state) => ({
      nodes: [...state.nodes, node],
      selectedNodeId: node.id,
      activePanel: "inspector",
    }));
    window.setTimeout(() => get().validate(), 0);
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId, activePanel: nodeId ? "inspector" : get().activePanel });
  },

  updateNodeData: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...data,
              } as WorkflowNodeData,
            }
          : node,
      ),
    }));
    window.setTimeout(() => get().validate(), 0);
  },

  deleteSelected: () => {
    const selectedNodeIds = new Set(get().nodes.filter((node) => node.selected).map((node) => node.id));
    const selectedEdgeIds = new Set(get().edges.filter((edge) => edge.selected).map((edge) => edge.id));
    const selectedNodeId = get().selectedNodeId;

    if (selectedNodeId) {
      selectedNodeIds.add(selectedNodeId);
    }

    set((state) => ({
      nodes: state.nodes.filter((node) => !selectedNodeIds.has(node.id)),
      edges: state.edges.filter(
        (edge) =>
          !selectedEdgeIds.has(edge.id) &&
          !selectedNodeIds.has(edge.source) &&
          !selectedNodeIds.has(edge.target),
      ),
      selectedNodeId: null,
    }));
    window.setTimeout(() => get().validate(), 0);
  },

  setAutomations: (automations) => {
    set({ automations });
    window.setTimeout(() => get().validate(), 0);
  },

  validate: () => {
    const { nodes, edges, automations } = get();
    const issues = validateWorkflow(nodes, edges, automations);
    set({ nodes: applyValidationToNodes(nodes, issues) });
  },

  resetWorkflow: () => {
    set({
      nodes: initialNodes,
      edges: initialEdges,
      selectedNodeId: null,
      activePanel: "inspector",
    });
    window.setTimeout(() => get().validate(), 0);
  },

  loadWorkflow: (workflow) => {
    set({
      nodes: workflow.nodes,
      edges: workflow.edges,
      selectedNodeId: null,
      activePanel: "sandbox",
    });
    window.setTimeout(() => get().validate(), 0);
  },

  setActivePanel: (panel) => {
    set({ activePanel: panel });
  },
}));

function createEdge(source: string, target: string): WorkflowEdge {
  return {
    id: `edge-${source}-${target}`,
    source,
    target,
    type: "smoothstep",
    animated: true,
    style: { strokeWidth: 2 },
  };
}
