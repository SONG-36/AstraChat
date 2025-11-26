// handler.js — AstraChat Chat API Lambda 入口（Node.js）

// 未来要接入的模块（先留着，后面一步步实现）
import { validateInput } from "./validator.js";
import { generateReply } from "./llm_client.js";
import { buildResponse } from "./response_builder.js";
import { retrieveContext } from "./rag_client.js";
import { loadSession, saveSession } from "./session_manager.js";
import { logger } from "./utils/logger.js";

/**
 * Lambda 主入口
 * @param {Object} event  - API Gateway 传入的事件，包含 HTTP 请求
 * @returns {Object}      - API Gateway Proxy 响应对象
 */
export const handler = async (event) => {
  // 1. 基础日志
  logger.info("AstraChat Lambda 收到请求", {
    path: event.path,
    method: event.httpMethod,
  });

  // 2. 解析 body
  let body;
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (err) {
    logger.error("JSON 解析失败", err);
    return makeHttpResponse(400, {
      error: {
        code: "BAD_REQUEST",
        message: "请求体不是合法的 JSON",
      },
    });
  }

  // 3. 输入校验（session_id / message / language 等）
  const validationError = validateInput(body);
  if (validationError) {
    logger.warn("输入校验失败", { validationError });
    return makeHttpResponse(400, {
      error: {
        code: "INVALID_INPUT",
        message: validationError,
      },
    });
  }

  const { session_id, message, language = "auto" } = body;

  try {
    // 4. 加载会话历史
    const history = await loadSession(session_id);

    // 5. RAG 检索
    const ragResult = await retrieveContext(message);
    const context = ragResult.context;
    const rawChunks = ragResult.rawChunks;

    // 6. 调用 LLM
    const llmResult = await generateReply({
      query: message,
      context,
      history,
      language,
    });

    // 7. 用 Response Builder 组装最终返回数据
    const finalPayload = buildResponse({
      query: message,
      context,
      history,
      llm_output: llmResult.raw_output,
      tokens: llmResult.tokens,
      rawChunks,
    });

    // 8. 保存本轮对话到 Session
    await saveSession(session_id, {
      user: message,
      assistant: finalPayload.assistant_message,
    });

    // 9. 返回 HTTP 200
    return makeHttpResponse(200, {
      ...finalPayload,
      session_id,
    });
  } catch (err) {
    // 10. 异常处理
    logger.error("Lambda 内部错误", err);

    return makeHttpResponse(500, {
      error: {
        code: "SERVER_ERROR",
        message: "服务器内部错误，请稍后重试。",
      },
    });
  }
};

/**
 * 构造 API Gateway Proxy Response
 */
function makeHttpResponse(statusCode, jsonBody) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
    body: JSON.stringify(jsonBody),
  };
}
