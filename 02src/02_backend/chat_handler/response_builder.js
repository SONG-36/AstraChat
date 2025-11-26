export function buildResponse({ llm_output, context, tokens }) {
  return {
    assistant_message: llm_output,
    context_used: context,
    tokens: tokens || { prompt: 0, completion: 0, total: 0 },
  };
}