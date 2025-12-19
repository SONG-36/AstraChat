import { decideRoute } from "../services/decision.service.js";

export class DecideStage {
  async execute(ctx) {
    ctx.route = decideRoute(ctx.normalized || "");
  }
}
