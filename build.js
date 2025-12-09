import esbuild from "esbuild";
import fs from "fs";
import path from "path";

// 输出目录
const outDir = "build";

// 清空旧文件
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir);

// 打包 Lambda handler
await esbuild.build({
    entryPoints: ["02src/02_backend/chat_handler/handler_entry.js"],
    bundle: true,
    platform: "node",
    target: "node20",
    outfile: `${outDir}/lambda_bundle.mjs`,
});

// 把 package.json 复制进去（node_modules 需要）
fs.copyFileSync("package.json", `${outDir}/package.json`);

// 把 node_modules 拷贝到 build 目录
fs.cpSync("node_modules", `${outDir}/node_modules`, { recursive: true });

// 打 zip 包
import { execSync } from "child_process";
execSync(`cd ${outDir} && zip -r function.zip .`, { stdio: "inherit" });

console.log("\nBuild completed → build/function.zip");
