import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// 1) 初始化 S3 客户端
const s3 = new S3Client({ region: process.env.AWS_REGION });

// 2) 进程缓存（Lambda/Node 常用，减少 S3 读取次数）
let cached = null;
let cachedAt = 0;
const TTL_MS = 5 * 60 * 100;

// 3) 把 S3 的 stream 转成字符串
async function streamToString(stream) {
    return await new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () =>
        resolve(Buffer.concat(chunks).toString("utf-8"))
        );
    });
}

// 4) 读取 canonical.json（带缓存）
export async function loadCanonical() {
    const now = Date.now();

    // ✅ 关键修复：cache 必须是 object / array 才能用
    if (cached && typeof cached === "object") {
        return { source: "CACHE", data: cached };
    }

    const res = await s3.send(
        new GetObjectCommand({
        Bucket: process.env.PRODUCT_KNOWLEDGE_BUCKET,
        Key: process.env.PRODUCT_KNOWLEDGE_KEY,
        })
    );

    const body = await streamToString(res.Body);

    let parsed;
    try {
        parsed = JSON.parse(body);
    } catch (e) {
        throw new Error("Failed to parse canonical.json");
    }

    // ✅ 再次防御：parsed 必须存在
    if (!parsed || typeof parsed !== "object") {
        throw new Error("canonical.json parsed to invalid object");
    }

    cached = parsed;
    cachedAt = now;

    return { source: "S3", data: cached };
}


// 5) 对外提供“确定性查询函数”：查功率
export async function queryPower() {
    const { source, data } = await loadCanonical();

    if (!data) {
        throw new Error("loadCanonical returned empty data");
    }

    // ✅ 企业级数据驯化：无条件变成 Array
    const records = Array.isArray(data)
        ? data
        : Object.values(data);

    const item = records.find(
        (x) => x.canonical_field === "power_watt"
    );

    if (!item) {
        return { status: "NOT_FOUND", source };
    }

    return {
        status: "OK",
        source,
        payload: {
        value: item.value,
        unit: item.unit,
        source_file: item.source_file,
        },
    };
}