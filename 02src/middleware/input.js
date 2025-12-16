import { BaseModule } from "./basemodule.js";

export class Input extends BaseModule {
  constructor() {
    super("Input");
  }

  async handle(ctx, next) {
    this.log(ctx, "校验输入");

    if (!ctx.userId) {
      throw new Error("userId 不能为空");
    }

    if (typeof ctx.rawMessage !== "string" || ctx.rawMessage.trim() === "") {
      throw new Error("message 必须为非空字符串");
    }

    this.log(ctx, "输入有效");
    await next();
  }
}
