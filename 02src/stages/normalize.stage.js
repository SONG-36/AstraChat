export class NormalizeStage {
  async execute(ctx) {
    // ctx.input.normalized = ctx.input.raw
    //   .trim()
    //   .replace(/\s+/g, " ");
    ctx.normalized = (ctx.text || "").trim();
  }
}
