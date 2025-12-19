export function decideRoute(text) {
    // 1) 确定性产品参数问题 → S3
    if (text.includes("功率") || text.includes("电压") || text.includes("参数")) {
        return "PRODUCT_KNOWLEDGE";
    }    

    // 2) 资料/历史类 → RAG（以后扩展）
    if (text.includes("历史") || text.includes("资料")) {
        return "RAG";
    }

    // 3) 默认 → LLM
    return "LLM";
}
