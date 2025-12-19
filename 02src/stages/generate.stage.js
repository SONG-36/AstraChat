import { queryPower } from "../adapters/productKnowledge.s3.adapter.js";

// 临时：用正则从文本里提取型号
function extractProductCode(text) {
  // 支持：MK-DM12-1、BZ-025 等
  const m = text.match(/[A-Z]{2,}-[A-Z0-9-]+/);
  return m ? m[0] : null;
}

export class GenerateStage {
    async execute(ctx) {
        switch (ctx.route) {
        case "PRODUCT_KNOWLEDGE": {
            const result = ctx.knowledgeResult;

            if (!result || result.status !== "OK") {
            ctx.output = "暂时没有找到该产品的相关参数。";
            return;
            }

            const { value, unit } = result.payload;
            ctx.output = `该产品的额定功率为 ${value}${unit}。`;
            return;
        }

        case "RAG": {
            ctx.output = "资料查询（RAG）功能还在开发中。";
            return;
        }

        default: {
            ctx.output = "你好，请问你想了解哪款产品的信息？";
            return;
        }
        }
    }
}

