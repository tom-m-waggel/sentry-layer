import { makeNodeTransport } from "@sentry/node"
import { LambdaInvocationContext } from "./lambdaContext";

export const forwardLogs = async (data: { context: LambdaInvocationContext, logs: any[] }) => {
  if (!data.logs.length) return;
  console.log("[Sentry Lambda Exension] Forwarding logs to sentry");

  const outcomes: Record<string, number> = {};
  const recordDroppedEvent = (reason: any, category: any) => {
    const key = `${reason}:${category}`;
    outcomes[key] = outcomes[key] + 1 || 1;
  }

  const transport = makeNodeTransport({
    url: data.logs[0].options.url,
    recordDroppedEvent
  });

  for (const log of data.logs) {
    await transport.send(log.envelope);
  }
  await transport.flush(2000);
};