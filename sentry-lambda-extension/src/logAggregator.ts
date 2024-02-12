const BEFORE_INIT = "BEFORE_INIT";
export class LogAggregator {
  public logMap: Record<string, any[]> = {};

  addLog(log: any, requestId: string = BEFORE_INIT): void {
    if (!(requestId in this.logMap)) {
      this.logMap[requestId] = [];
    }
    this.logMap[requestId].push(log);
  }

  getLogs(requestId: string): any[] {
    const logs = this.logMap[requestId];
    if (logs === undefined) {
      return [];
    }
    return logs;
  }

  deleteLogs(requestId: string): void {
    delete this.logMap[requestId];
  }
}