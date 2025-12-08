import { handler } from './lambda_bundle.mjs';

const event = {
  body: JSON.stringify({
    message: "测试 Lambda 版本"
  }),
};

handler(event).then(res => {
  console.log("Lambda Response:", res);
});
