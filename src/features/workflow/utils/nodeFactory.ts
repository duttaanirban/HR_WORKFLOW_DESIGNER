import type { WorkflowNodeData, WorkflowNodeType } from "../types/workflow.types";

export function createNodeData(type: WorkflowNodeType): WorkflowNodeData {
  switch (type) {
    case "start":
      return {
        type,
        label: "Start",
        title: "New HR workflow",
        metadata: { trigger: "employee_created" },
      };
    case "task":
      return {
        type,
        label: "Task",
        title: "Collect documents",
        description: "Ask the employee to submit required onboarding documents.",
        assignee: "HR Executive",
        dueDate: "",
        customFields: { priority: "normal" },
      };
    case "approval":
      return {
        type,
        label: "Approval",
        title: "Manager approval",
        approverRole: "Manager",
        autoApproveThreshold: 0,
      };
    case "automation":
      return {
        type,
        label: "Automation",
        title: "Send notification",
        actionId: "send_email",
        params: { to: "employee.email", subject: "Welcome aboard" },
      };
    case "end":
      return {
        type,
        label: "End",
        message: "Workflow completed",
        showSummary: true,
      };
  }
}

export function getNodeDisplayTitle(data: WorkflowNodeData) {
  switch (data.type) {
    case "start":
      return data.title || "Start";
    case "task":
      return data.title || "Task";
    case "approval":
      return data.title || "Approval";
    case "automation":
      return data.title || "Automation";
    case "end":
      return data.message || "End";
  }
}
