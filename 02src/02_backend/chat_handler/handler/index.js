import { simpleChat } from '../services/llm_client.js';

export async function handler(event) {
  try {
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
          error: 'message is required',
        }),
      };
    }

    // 2. 调用服务层，可能成功也可能失败
    const result = await simpleChat(userMessage);

    // 3. 根据 result.ok 判断成功还是失败
    if (!result.ok) {
      // 服务层识别出错误（V1 不重试，只上报）
      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          errorType: result.errorType,
          retryAfter: result.retryAfter,
          message: result.message,
        }),
      };
    }

    // 4. 成功情况
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        reply: result.replyText,
      }),
    };

  } catch (err) {
    console.error('[handler] fatal error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: 'internal_error',
        message: err.message,
      }),
    };
  }
}
