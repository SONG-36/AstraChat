import { Context } from "./runtime/context.js";
import { createPipeline } from "./runtime/pipeline.js";

import { InputStage } from "./stages/input.stage.js";
import { NormalizeStage } from "./stages/normalize.stage.js";
import { DecideStage } from "./stages/decide.stage.js";
import { GenerateStage } from "./stages/generate.stage.js";
import { RespondStage } from "./stages/respond.stage.js";

const pipeline = createPipeline([
  new InputStage(),
  new NormalizeStage(),
  new DecideStage(),
  new GenerateStage(),
  new RespondStage(),
]);

async function main() {
  const ctx = new Context({
    userId: "u001",
    input: "你好，介绍一下 AWS",
  });

  const result = await pipeline.run(ctx);
  console.log("OUTPUT:", result.text);
}

main();
