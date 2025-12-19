// 让 node 运行时自动读取根目录 .env
import "dotenv/config";

// 可选：做一次“启动自检”，避免你再踩 undefined 的坑
export function assertEnv() {
  const need = ["AWS_REGION", "PRODUCT_KNOWLEDGE_BUCKET", "PRODUCT_KNOWLEDGE_KEY"];
  for (const k of need) {
    if (!process.env[k]) {
      throw new Error(`Missing env: ${k}`);
    }
  }
}