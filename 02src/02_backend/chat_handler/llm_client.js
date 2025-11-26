export async function generateReply({ query }) {
  return {
    raw_output: `（测试环境）你刚刚说：${query}`,
    tokens: {
      prompt: 0,
      completion: 0,
      total: 0,
    },
  };
}