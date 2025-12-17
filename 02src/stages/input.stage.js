export class InputStage {
    async execute(ctx) {
        if (!ctx.input.raw) {
            throw new Error("input.raw is required");
        }
        ctx.log("Input received");
    }
}
