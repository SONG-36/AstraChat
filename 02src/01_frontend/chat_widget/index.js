// index.js — AstraChat Widget
console.log("INDEX.JS 加载成功");

// 1. 找到根容器
const root = document.getElementById("astra-chat-root");
console.log("找到 root：", root);

// 2. 渲染基础布局
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

// === 绑定交互 ===
const input = document.getElementById("send-input");
const sendBtn = document.getElementById("send-btn");
const messages = document.getElementById("messages");

// 发送消息函数
function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // 追加新消息
    const bubble = document.createElement("div");
    bubble.style.margin = "4px 0";
    bubble.style.padding = "6px 8px";
    bubble.style.background = "#e8f0ff";
    bubble.style.borderRadius = "4px";
    bubble.style.width = "fit-content";
    bubble.textContent = text;

    messages.appendChild(bubble);

    // 自动滚到底
    messages.scrollTop = messages.scrollHeight;

    // 自动清空输入框
    input.value = "";
}

// 按钮点击发送
sendBtn.addEventListener("click", sendMessage);

// 回车键发送
input.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
        sendMessage();
    }
});
