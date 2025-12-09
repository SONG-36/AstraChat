import { simpleChat } from '../services/llm_client.js';
import { parseInput } from './request_parser.js';
import { successResponse, errorResponse } from './response_builder.js';

export const handler = async (event) => {
  try {
    //1. 统一入口：解析输入（支持 { body: "..." } / 直接 JSON 等）
    const parsed = parseInput(event);

    //1.1 schema 级错误 -> 400
    if (parsed.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          error: {
            type: parsed.error.type || 'bad_rquest',
            message: parsed.error.mesage || 'invalid request',
          },
          meat: {},
        }),
      };
    }

    const { action, payload } = parsed;

    //1.2 暂时只支持一个动作：chat
    if (action !== 'chat') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          error: {
            type: 'unsupported_action',
            message: `Unknown action: ${action}`,        
         },
        meta: {},
        }),
      };
    }

    const userMessage = payload.message;

    //2 调用服务层（可能成功/失败）
    const result = await simpleChat(userMessage);

    //3 根据 result.ok 输出不同结构
    if (!result.ok) {
      return errorResponse(
        {
          errorType: result.errorType,
          retryAfter: result.retryAfter,
          message: result.message,
        },
        {
          provider: 'openai',
        }
      );
    }

    //4 成功响应
    return successResponse(result.replyText, {
      provider: 'openai',
      model: 'gpt-4.1-mini',
    });

  } catch (err) {
    console.error('[handler] fatal error:', err);
    return errorResponse(
      { errorType: 'internal_error', message: err.message },
      { provider: 'unknown' }
    );
  }
}
