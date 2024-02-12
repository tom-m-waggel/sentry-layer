import { EventTypes, ExtensionAPIService } from "lambda-extension-service";
import { LogAggregator } from "./logAggregator";
import { listenForLog } from "./logServer";
import { LambdaContext } from "./lambdaContext";
import { forwardLogs } from "./logForwarder";

console.log("[Sentry Lambda Exension] Executing extension code...");

const main = async () => {
  const logAggregator = new LogAggregator();
  const lambdaContext = new LambdaContext();
  const onLogReceived = (log: any) => {
    console.log('[Sentry Lambda Exension] Log received', lambdaContext.getRequestId())
    logAggregator.addLog(log, lambdaContext.getRequestId());
  };
  console.log('[Sentry Lambda Exension] Listening for logs...')
  listenForLog(onLogReceived);

  const extensionApiService = new ExtensionAPIService({
    extensionName: "sentry-lambda-extension",
  });
  const extensionId = await extensionApiService.register([EventTypes.Invoke, EventTypes.Shutdown]);
  console.log(`[Sentry Lambda Exension] Registered with extension API service ${extensionId}. Listening for events...`);

  while (true) {
    const event = await extensionApiService.next();
    const lastContext = lambdaContext.getContext();
    lambdaContext.updateContext(event);

    if (lastContext !== undefined) {
      await forwardLogs({
        context: lastContext,
        logs: logAggregator.getLogs(lastContext.requestId),
      });
      logAggregator.deleteLogs(lastContext.requestId);
    }
  }
};

main().catch((error) => console.error(error));