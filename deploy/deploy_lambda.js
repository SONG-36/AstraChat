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

    const testPayload = JSON.stringify({
    body: JSON.stringify({
        message: "hello from deploy script"
    })
    });

    const testResult = execSync(`
        aws lambda invoke \
        --function-name AstraChatHandler \
        --cli-binary-format raw-in-base64-out \
        --payload '${testPayload}' \
        response.json
        `, { encoding: "utf-8" });

    console.log("Lambda invocation result:", testResult);

    console.log(testResult);

    console.log("📄 Response saved to response.json\n");

} catch (err) {
    console.error("❌ Error during post-deploy checks:", err);
}
