import { createServer } from "node:http";

type LogServerOptions = {
  port: number;
};
export const listenForLog = (
  onLogReceived: (log: any) => void,
  { port }: LogServerOptions = { port: 4000 }
) => {
  const server = createServer((request: any, response: any) => {
    if (request.method == "POST") {
      let body = "";
      request.on("data", function (data: any) {
        body += data;
      });
      request.on("end", function () {
        response.writeHead(200, {});
        response.end("OK");
        try {
          onLogReceived(JSON.parse(body));
        } catch (e) {
          console.error("[Sentry Lambda Exension] Failed to parse logs", e);
        }
      });
    }
  });

  server.keepAliveTimeout = 0;
  server.listen(port, "sandbox");
  console.info(`[Sentry Lambda Exension] Listening for logs at http://sandbox:${port}`);
};