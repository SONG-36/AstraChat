import { execSync } from "child_process";

console.log("\n🚀 Deployment finished. Fetching Lambda status...\n");

try {
    const result = execSync(
        `aws lambda get-function-configuration --function-name AstraChatHandler`,
        { encoding: "utf-8" }
    );

    console.log("📌 Lambda Configuration:");
    console.log(result);

    console.log("\n🧪 Running a quick test invocation...\n");

    // FIXED: Lambda 需要 event.body 是 JSON 字符串
    const testPayload = JSON.stringify({
    body: JSON.stringify({
        action: "chat",
        payload: { message: "hello from deploy script" }
    }),
    });

    const testResult = execSync(
        `aws lambda invoke \
            --function-name AstraChatHandler \
            --cli-binary-format raw-in-base64-out \
            --payload '${testPayload}' \
            response.json`,
        { encoding: "utf-8" }
    );

    console.log("🟦 Invocation result:");
    console.log(testResult);

    console.log("📄 Response saved to response.json\n");

} catch (err) {
    console.error("❌ Error during post-deploy checks:", err);
}
