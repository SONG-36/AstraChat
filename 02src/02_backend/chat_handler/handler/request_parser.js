export function parseInput(event) {
  // 1) event 必须是一个对象
  if (!event || typeof event !== "object") {
    return {
      error: { type: "bad_request", message: "Event must be a JSON object" },
    };
  }

  // 2) action 必须存在
  if (typeof event.action !== "string") {
    return {
      error: { type: "bad_request", message: "'action' is required" },
    };
  }

  // 3) payload.message 必须存在且为字符串
  if (
    !event.payload ||
    typeof event.payload.message !== "string" ||
    event.payload.message.trim() === ""
  ) {
    return {
      error: {
        type: "bad_request",
        message: "'payload.message' is required",
      },
    };
  }

  // 4) 全部通过，返回规范化结构
  return {
    action: event.action,
    payload: {
      message: event.payload.message.trim(),
    },
  };
}
