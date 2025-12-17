export class RespondStage {
  async execute(ctx) {
    ctx.output.text =
      ctx.state.llmResult ?? "No response generated";

    ctx.log("Response prepared");
  }
}
