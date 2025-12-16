import { BaseModule } from "./basemodule.js";

export class Response extends BaseModule {
  constructor() {
    super("Response");
  }

  async handle(ctx, next) {
    this.log(ctx, "构造最终响应");

    ctx.response = {
      success: true,
      traceId: ctx.traceId ?? "trace_dummy",
      data: {
        answer: `【占位回复】你说：${ctx.normalizedMessage}`,
      },
    };

    await next();
  }
}
