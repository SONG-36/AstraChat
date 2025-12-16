export class BaseModule {
  constructor(name) {
    this.name = name ?? this.constructor.name;
  }

  async handle(ctx, next) {
    throw new Error(`${this.name}.handle() 未实现`);
  }

  log(ctx, msg) {
    ctx.addLog(`[${this.name}] ${msg}`);
  }
}
