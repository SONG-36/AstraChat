import { callOpenAI } from '../providers/openai_provider.js';

export async function simpleChat(userMessage) {
  const systemPrompt =
    'You are a helpful assistant for AWS + AI learning. ' +
    'Answer briefly in Chinese unless the user asks otherwise.';

    const replyText = await callOpenAI({
      systemPrompt,
      userPrompt: userMessage,
    });

    return {
      replyText,
    };
}