import { handler } from './02_backend/chat_handler/handler/index.js';

async function main() {
  const event = {
    body: JSON.stringify({
      message: "测试一下断网错误"
    }),
  };

  const res = await handler(event);

  console.log('statusCode:', res.statusCode);
  console.log('body:', res.body);
}

main();
