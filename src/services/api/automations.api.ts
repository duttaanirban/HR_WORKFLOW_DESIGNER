import { automationDefinitions } from "./mockData";

export async function getAutomations() {
  await delay(250);
  return automationDefinitions;
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
