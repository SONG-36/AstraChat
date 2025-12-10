// index.js — AstraChat Widget
import { sendMessageToLambda } from "./api_client.js";

console.log("INDEX.JS 加载成功");

// ===============================
// 1. 渲染 Widget UI
// ===============================
const root = document.getElementById("astra-chat-root");

root.innerHTML = `
    <div id="astra-widget" style="
        width: 300px;
        height: 400px;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 10px;
        font-family: sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    ">
        <h3>AstraChat Widget</h3>

        <!-- 消息显示区 -->
        <div id="messages" style="
            flex: 1;
            border: 1px solid #eee;
            background: #f7f9ff;
            border-radius: 6px;
            padding: 8px;
            overflow-y: auto;
            font-size: 14px;
        "></div>

        <!-- 输入区 -->
        <div id="input-area" style="
            display: flex;
            margin-top: 10px;
            gap: 8px;
        ">
            <input id="send-input" 
                type="text" 
                placeholder="请输入消息..."
                style="
                    flex: 1;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                "
            />
            <button id="send-btn" style="
                padding: 0 16px;
                background: #4f6df5;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">
                发送
            </button>
        </div>
    </div>
`;

const input = document.getElementById("send-input");
const sendBtn = document.getElementById("send-btn");
const messages = document.getElementById("messages");

// 工具函数：展示消息
function addMessage(role, text) {
    const bubble = document.createElement("div");
    bubble.style.margin = "6px 0";
    bubble.style.padding = "6px 8px";
    bubble.style.borderRadius = "4px";
    bubble.style.width = "fit-content";
    bubble.style.maxWidth = "90%";

    if (role === "user") {
        bubble.style.background = "#e8f0ff";
        bubble.style.alignSelf = "flex-end";
    } else if (role === "ai") {
        bubble.style.background = "#d1ffd6";
        bubble.style.alignSelf = "flex-start";
    } else {
        bubble.style.background = "#ffe1e1";
        bubble.style.color = "#c00";
    }

    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
}

// ===============================
// 发送流程（正式版）
// ===============================
async function sendMessage() {
    const userMsg = input.value.trim();
    if (!userMsg) return;

    addMessage("user", userMsg);
    input.value = "";

    // 显示“思考中”
    const thinking = document.createElement("div");
    thinking.textContent = "AI 正在思考…";
    thinking.style.padding = "6px 8px";
    thinking.style.background = "#fff3cd";
    thinking.style.borderRadius = "4px";
    messages.appendChild(thinking);

    // 调用后端
    const result = await sendMessageToLambda(userMsg);

    // 移除思考提示
    thinking.remove();

    // 正常返回
    if (result.ok) {
        addMessage("ai", result.data.reply.text);
    }
    // 错误返回
    else {
        addMessage("error", result.error?.message || "未知错误");
    }
}

// 绑定事件
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (ev) => ev.key === "Enter" && sendMessage());