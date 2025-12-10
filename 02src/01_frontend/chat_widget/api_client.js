const API_URL = "https://nhsdqe7zztsodbdk6lhp7pbt5a0qrkds.lambda-url.ap-southeast-1.on.aws/";

export async function sendMessageToLambda(userMessage) {

  // 🔥 Step 1：打印即将发送的内容
  const payload = { message: userMessage };
  console.log("[FE] 即将发送给 Lambda 的 payload:", payload);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // 🔥 Step 2：打印 HTTP 状态码
    console.log("[FE] Lambda HTTP status:", res.status);

    // 🔥 Step 3：打印原始响应文本
    const rawText = await res.text();
    console.log("[FE] Lambda 原始响应文本:", rawText);

    // Lambda 返回的 JSON 在 body 字段里
    let json;
    try {
      json = JSON.parse(rawText);
      console.log("[FE] 解析后的 JSON:", json);
    } catch (err) {
      console.error("[FE] JSON.parse 失败:", err);
      return { ok: false, error: { message: "返回格式异常" } };
    }

    return json;

  } catch (err) {
    console.error("[FE] 调用 Lambda 网络错误:", err);
    return {
      ok: false,
      error: { message: "网络错误：无法连接服务器" },
    };
  }
}
