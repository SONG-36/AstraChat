export function decideRoute(text) {
  if (text.includes("历史") || text.includes("资料")) {
    return "RAG"; // 以后扩展
  }
  return "LLM";
}
