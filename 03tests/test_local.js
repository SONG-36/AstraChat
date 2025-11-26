import { handler } from "../02src/02_backend/chat_handler/handler.js";

const fakeEvent = {
  path: "/chat",
  httpMethod: "POST",
  body: JSON.stringify({
    session_id: "test-session-001",
    message: "你好，AstraChat",
    language: "zh",
  }),
};

handler(fakeEvent).then((res) => {
  console.log("Lambda 返回：", res);
});