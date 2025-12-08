import { simpleChat } from '../services/llm_client.js';
import { successResponse, errorResponse } from './response_builder.js';

export const handler = async (event) => {
  try {
    //1 解析输入
    let body = {};
    if (event?.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    }

    const userMessage = body.message || '';

    if (!userMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          error: { type: 'bad_request', message: 'message is required' },
          meta: {},
        }),
      };
    }

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
