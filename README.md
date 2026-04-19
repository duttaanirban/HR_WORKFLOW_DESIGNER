# HR Workflow Designer

A functional React + React Flow prototype for designing and testing internal HR workflows such as onboarding, leave approval, and document verification.

## Features

- Drag-and-drop React Flow canvas
- Custom node types: Start, Task, Approval, Automation, End
- Node-specific configuration forms
- Dynamic automation parameters from a mock `GET /automations` API
- Mock `POST /simulate` workflow execution
- Graph validation for missing connections, start/end rules, unreachable nodes, required fields, and cycles
- Workflow sandbox with execution timeline and serialized JSON preview
- Import/export workflow JSON
- Mini-map, zoom controls, fit view, and delete actions

## Diagrams

Workflow and architecture diagrams are available in [docs/PROJECT_DIAGRAMS.md](docs/PROJECT_DIAGRAMS.md).

## Tech Stack

- Vite
- React
- TypeScript
- React Flow
- Zustand
- CSS modules by folder convention with a single global stylesheet for the prototype

## How To Run

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Architecture

```txt
src/
  app/                     App entry
  components/layout/        Sidebar, inspector, sandbox, shell
  features/workflow/
    canvas/                 React Flow canvas and node type registration
    forms/                  Node-specific editable forms
    hooks/                  Zustand store, automations loader, simulation hook
    nodes/                  Custom visual node component
    types/                  Typed workflow node data and API models
    utils/                  Serialization, graph traversal, validation
  services/api/             Mock API layer
  styles/                   Global prototype styling
```

The workflow data model uses a discriminated union, so each node type has a clear and extensible configuration shape. Canvas state is centralized in Zustand because the node palette, inspector, validation, sandbox, and import/export all need to read or update the same graph.

## Design Decisions

- React Flow handles graph rendering, connection management, controls, and mini-map.
- The mock API layer is isolated under `services/api` so a real backend can replace it without changing UI components.
- Validation lives outside components and returns structured issues that can be shown both on nodes and in the sandbox.
- Automation forms are dynamic: selecting an action updates the required parameter fields from the mock automation definition.
- The app starts with a complete sample workflow so evaluators can test immediately.

## Completed

- Required node types
- Drag from sidebar to canvas
- Connect and delete nodes/edges
- Select node and edit configuration
- Dynamic automation action parameters
- Mock automations API
- Mock simulation API
- Validation and execution log
- JSON import/export
- README documentation

## With More Time

- Undo/redo history
- Auto-layout for larger workflows
- Node templates and saved workflow presets
- Version history
- Backend persistence and authenticated multi-user editing
