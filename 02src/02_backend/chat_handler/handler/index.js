import { simpleChat } from '../services/llm_client.js'

export async function handler(event) {
  try {
    //1 解析输入
    let body = {};
    if (event?.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    }

    const userMessage = body.message || '';

    if(!userMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ok: false, error: 'message is required'}),
      };
    }

    //2 调用services
    const result = await simpleChat(userMessage);

    //3 构建返回
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        reply: result.replyText,
      }),
    };
  } catch (err) {
    console.error('[handler] error:', err);

    return {
      statusCode: 500,
      body:JSON.stringify({
        ok: false,
        error: 'internal_error',
        message: err.message,
      }),
    };
  }
}