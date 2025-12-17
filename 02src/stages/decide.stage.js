import { decideRoute } from "../services/decision.service.js";

export class DecideStage {
  async execute(ctx) {
    ctx.state.route = decideRoute(ctx.input.normalized);
    ctx.log(`Route decided: ${ctx.state.route}`);
  }
}
