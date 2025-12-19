import { assertEnv } from "./env.js";
import { createContext } from "./runtime/context.js";
import { buildStages } from "./runtime/pipeline.js";
import { Engine } from "./runtime/engine.js";

// 1) 启动自检：环境变量必须齐全
assertEnv();

// 2) 构建引擎
const engine = new Engine(buildStages());

// 3) 三条测试用例
const tests = [
  "MK-DM12-1 功率多少",
  "给我这款产品资料",
  "你好",
];

for (const t of tests) {
  console.log("\nINPUT:", t);
  const ctx = createContext({ rawMessage: t });
  await engine.run(ctx);
}
