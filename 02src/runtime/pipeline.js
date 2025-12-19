import { InputStage } from "../stages/input.stage.js";
import { NormalizeStage } from "../stages/normalize.stage.js";
import { DecideStage } from "../stages/decide.stage.js";
import { GenerateStage } from "../stages/generate.stage.js";
import { RespondStage } from "../stages/respond.stage.js";

export function buildStages() {
  return [
    new InputStage(),
    new NormalizeStage(),
    new DecideStage(),
    new GenerateStage(),
    new RespondStage(),
  ];
}