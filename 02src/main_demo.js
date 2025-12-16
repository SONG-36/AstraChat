import { Context } from "./core/context.js";
import { Engine } from "./core/engine.js";

import { Input } from "./middleware/input.js";
import { Normalize } from "./middleware/normalize.js";
import { Response } from "./middleware/response.js";

function generateTraceId() {
  const now = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `req_${now}_${rand}`;
}

async function main() {
  const ctx = new Context({
    userId: "user_123",
    message: "   你好     AstraChat   ",
  });

  ctx.traceId = generateTraceId();

  const engine = new Engine([
    new Input(),
    new Normalize(),
    new Response(),
  ]);

  await engine.run(ctx);

  console.log("=== 最终响应 ===");
  console.log(ctx.response);

  console.log("\n=== 执行日志 ===");
  console.log(ctx.logs.join("\n"));
}

main().catch(console.error);
