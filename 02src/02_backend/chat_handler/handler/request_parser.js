export function parseInput(event) {
    let input = event;

    //Support API Gateway proxy format
    if (event?.body) {
        try {
            input = typeof event.body === "string"
              ? JSON.parse(event.body)
              : event.body;
        } catch (err) {
            return {
                error: {
                    type: "bad_json",
                    message: "Invalid JSON in event.body"
                }
            };
        }
    }

    //Must be object
    if (!input || typeof input !== "object") {
        return {
            error: {
                type: "bad_request",
                message: "Input must be a JSON object"
            }
        };
    }

    const { action, payload } = input;

    if (!action) {
        return {
            error: {
                type: "bad_request",
                message: "'action' is required"
            }
        };
    }

    if (!payload || typeof payload.message !== "string") {
        return {
            error: {
                type: "bad_request",
                message: "'payload.message' is required"
            }
        };
    }

    return {action, payload};
}