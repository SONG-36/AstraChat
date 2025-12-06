import { handler } from './02_backend/chat_handler/handler/index.js';

async function main() {
    //模拟一个http请求事件
    const event = {
        body: JSON.stringify({
            message: '用一句话解释什么是AWS Lambda.',
        }),
    };

    const res = await handler(event);

    console.log('statusCode:', res.statusCode);
    console.log('body:', res.body);

    try {
        const parsed = JSON.parse(res.body);
        console.log('parsed body:', parsed);
    } catch (e) {

    }
}

main().catch(console.error);