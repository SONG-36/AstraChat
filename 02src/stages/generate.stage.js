import { callLLM } from "../adapters/llm.adapter.js";

export class GenerateStage {
  async execute(ctx) {
    if (ctx.state.route !== "LLM") return;

    ctx.state.llmResult = await callLLM(ctx.input.normalized);
    ctx.log("LLM generated result");
  }
}
