import {Engine} from "./engine.js"

export function createPipeline(stages) {
    return new Engine(stages);
}