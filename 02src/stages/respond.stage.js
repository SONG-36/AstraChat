export class RespondStage {
  async execute(ctx) {
    console.log("DEBUG route =", ctx.route);
    if (ctx.logs?.length) console.log("DEBUG logs =", JSON.stringify(ctx.logs, null, 2));
    console.log("OUTPUT:", ctx.output);
  }
}