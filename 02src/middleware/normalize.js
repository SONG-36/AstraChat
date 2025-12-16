import { BaseModule } from "./basemodule.js";

export class Normalize extends BaseModule {
  constructor() {
    super("Normalize");
  }

  async handle(ctx, next) {
    this.log(ctx, "规范化输入");

    ctx.normalizedMessage = ctx.rawMessage.trim().replace(/\s+/g, " ");

    this.log(ctx, `结果: "${ctx.normalizedMessage}"`);
    await next();
  }
}
