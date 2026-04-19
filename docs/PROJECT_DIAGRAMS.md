# Project Diagrams

## HR Workflow Diagram

This diagram shows the default workflow that ships with the prototype and the way the sandbox executes it.

```mermaid
flowchart LR
  A([Start Node<br/>Employee workflow begins])
  B[Task Node<br/>Collect documents]
  C{Approval Node<br/>Manager / HR approval}
  D[Automated Step Node<br/>Send email / generate document]
  E([End Node<br/>Workflow completed])

  A --> B
  B --> C
  C -->|Approved| D
  C -.->|Rejected / needs changes| B
  D --> E

  subgraph Configuration["Node Configuration Panel"]
    F[Start metadata]
    G[Task title, assignee, due date, custom fields]
    H[Approver role and auto-approve threshold]
    I[Automation action and dynamic params]
    J[End message and summary flag]
  end

  F -. configures .-> A
  G -. configures .-> B
  H -. configures .-> C
  I -. configures .-> D
  J -. configures .-> E
```

## User Interaction Flow

```mermaid
sequenceDiagram
  actor HR as HR Admin
  participant Sidebar as Node Palette
  participant Canvas as React Flow Canvas
  participant Store as Zustand Workflow Store
  participant Inspector as Node Form Panel
  participant API as Mock API Layer
  participant Sandbox as Workflow Sandbox

  HR->>Sidebar: Drag node template
  Sidebar->>Canvas: Drop node type
  Canvas->>Store: addNode(type, position)
  Store-->>Canvas: Render updated graph

  HR->>Canvas: Connect nodes
  Canvas->>Store: onConnect(edge)
  Store->>Store: validate workflow
  Store-->>Canvas: Show validation state on nodes

  HR->>Canvas: Select node
  Canvas->>Store: selectNode(nodeId)
  Store-->>Inspector: Selected node data
  HR->>Inspector: Edit configuration
  Inspector->>Store: updateNodeData(nodeId, changes)
  Store->>Store: validate workflow

  HR->>Sandbox: Run simulation
  Sandbox->>Store: Serialize nodes and edges
  Sandbox->>Store: Validate graph
  Sandbox->>API: POST /simulate workflow JSON
  API-->>Sandbox: Step-by-step execution log
  Sandbox-->>HR: Display timeline and JSON
```

## Application Architecture Diagram

```mermaid
flowchart TB
  User[HR Admin]

  subgraph UI["React UI Layer"]
    AppShell[AppShell]
    Sidebar[Sidebar<br/>Node palette]
    Canvas[WorkflowCanvas<br/>React Flow]
    Nodes[Custom Node Components]
    Inspector[InspectorPanel]
    Forms[Node-specific Forms]
    Sandbox[SandboxPanel]
  end

  subgraph State["Client State Layer"]
    Store[useWorkflowStore<br/>Zustand]
    AutoHook[useAutomations]
    SimHook[useWorkflowSimulation]
  end

  subgraph Domain["Workflow Domain Layer"]
    Types[workflow.types.ts<br/>Discriminated unions]
    Factory[nodeFactory.ts]
    Validation[validateWorkflow.ts]
    Graph[graph.ts<br/>Traversal and cycle checks]
    Serialization[serializeWorkflow.ts]
  end

  subgraph API["Mock API Layer"]
    AutomationsAPI[GET /automations<br/>automations.api.ts]
    SimulationAPI[POST /simulate<br/>simulation.api.ts]
    MockData[mockData.ts]
  end

  User --> AppShell
  AppShell --> Sidebar
  AppShell --> Canvas
  AppShell --> Inspector
  Inspector --> Forms
  Inspector --> Sandbox
  Canvas --> Nodes

  Sidebar --> Store
  Canvas --> Store
  Forms --> Store
  Sandbox --> Store

  Store --> Types
  Store --> Factory
  Store --> Validation
  Validation --> Graph
  Sandbox --> Serialization

  AutoHook --> AutomationsAPI
  SimHook --> SimulationAPI
  AutomationsAPI --> MockData
  SimulationAPI --> Graph
  SimulationAPI --> MockData

  AppShell --> AutoHook
  Sandbox --> SimHook
```

## Deployment / Runtime Architecture

```mermaid
flowchart LR
  Browser[Browser]
  Vite[Vite Dev Server<br/>localhost:5173]
  React[React App Bundle]
  ReactFlow[React Flow Renderer]
  Zustand[In-memory Zustand Store]
  MockAPI[Local Mock API Functions]

  Browser --> Vite
  Vite --> React
  React --> ReactFlow
  React --> Zustand
  React --> MockAPI
  MockAPI --> Zustand

  subgraph NoBackend["Current Prototype Boundary"]
    Zustand
    MockAPI
  end

  subgraph FutureBackend["Future Production Replacement"]
    Auth[OAuth / OIDC]
    Backend[FastAPI / Node API]
    DB[(PostgreSQL / Firestore)]
  end

  MockAPI -. replace with .-> Backend
  Backend --> Auth
  Backend --> DB
```

