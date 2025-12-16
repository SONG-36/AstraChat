export class Context {
  constructor({ userId, message }) {
    this.userId = userId ?? null;
    this.rawMessage = message ?? null;

    this.traceId = null;

    // 处理过程中动态挂载字段
    this.normalizedMessage = null;
    this.response = null;

    // 调试日志
    this.logs = [];
  }

  addLog(msg) {
    const time = new Date().toISOString();
    this.logs.push(`[${time}] ${msg}`);
  }
}
