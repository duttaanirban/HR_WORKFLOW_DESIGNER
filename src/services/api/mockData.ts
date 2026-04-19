import type { AutomationDefinition } from "../../features/workflow/types/workflow.types";

export const automationDefinitions: AutomationDefinition[] = [
  { id: "send_email", label: "Send Email", params: ["to", "subject"] },
  { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
  { id: "create_ticket", label: "Create IT Ticket", params: ["queue", "summary"] },
  { id: "notify_slack", label: "Notify Slack Channel", params: ["channel", "message"] },
];
