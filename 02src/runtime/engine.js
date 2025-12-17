export class Engine {
    constructor(stages = []) {
        this.stages = stages;
    }

    async run(ctx) {
        for (const stage of this.stages) {
            await stage.execute(ctx);
        }
        return ctx.output;
    }
}