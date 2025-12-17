import crypto from "crypto"

export class Context {
    constructor({ userId, input}) {
        this.meta = {
            userId,
            traceId: crypto.randomUUID(),
            timestamp: Date.now(),
        };

        this.input = {
            raw: input,
            normalized: null,
        };

        this.state = {
            route:null,
            llmResult: null,
        };

        this.output = {
            text: null,
        };

        this.logs = [];
    }

    log(msg) {
        this.logs.push(`[${new Date().toISOString()}] ${msg}`);
    }
}