import { callOpenAI } from '../providers/openai_provider.js';

export async function simpleChat(userMessage) {
  const systemPrompt =
    'You are a helpful assistant for AWS + AI learning. ' +
    'Answer briefly in Chinese unless the user asks otherwise.';

    try {
      console.log("CALLING callOpenAI NOW...");
      //1.调用provider 
      const replyText = await callOpenAI({
        systemPrompt,
        userPrompt: userMessage,
      });

      //2.provider 成功情况
      return {
        ok: true,
        replyText,
      };
    } catch (err) {
      console.log("ERROR CAUGHT IN simpleChat:", err);
      // 3. provider 失败 → llm_client 只负责“识别 + 转换”

      // === 基本错误分类 ===
      // 错误对象来自 openai_provider.js 的结构化格式：
      // { type, status, retryAfter, message }
      
      const errorType = err?.type || 'unknown';
      const retryAfter = err?.retryAfter || null;

      return {
        ok: false,
        errorType,
        retryAfter,
        message: err.message,
      };
    }
}