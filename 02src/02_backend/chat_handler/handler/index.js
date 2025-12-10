import { simpleChat } from '../services/llm_client.js';
import { parseInput } from './request_parser.js';
import { successResponse, errorResponse } from './response_builder.js';

export const handler = async (event) => {
  try {
    // 1. 解析输入
    const parsed = parseInput(event);

    // 1.1 schema 错误
    if (parsed.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          error: parsed.error,
          meta: {},
        }),
      };
    }

    const { action, payload } = parsed;

    // 1.2 限制只支持 chat
    if (action !== "chat") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          error: {
            type: "unsupported_action",
            message: `Unknown action: ${action}`,
          },
          meta: {},
        }),
      };
    }

    const userMessage = payload.message;

    // 2. 调用 OpenAI
    const result = await simpleChat(userMessage);

    if (!result.ok) {
      return errorResponse(
        {
          errorType: result.errorType,
          retryAfter: result.retryAfter,
          message: result.message,
        },
        { provider: "openai" }
      );
    }

    // 3. 成功响应
    return successResponse(
      {
        reply: result.replyText,
      },
      { provider: "openai", model: "gpt-4.1-mini" }
    );

  } catch (err) {
    console.error("[handler] fatal error:", err);
    return errorResponse(
      { errorType: "internal_error", message: err.message },
      { provider: "unknown" }
    );
  }
};
