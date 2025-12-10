# AstraChat — Project Canvas

**一个可嵌入网页的智能客服系统（AWS Lambda + OpenAI）**
 展示后端工程能力、前端组件化能力、AI 服务封装能力。

## 1 Problem

- 网站需要轻量、可嵌入、可扩展的 AI 客服组件。
- 现成方案无法定制，也不适用于工程展示与面试。
- 希望用真实工程系统展示 AI 服务端能力。

## 2 Vision

打造一个 **企业级架构、模块化中间件、可扩展 AI 能力** 的智能客服系统，用来展示工程能力，并作为未来项目（语音、图片、RAG、工具调用等）的基础平台。

## 3 Solution Overview

### 前端 Chat Widget

- 易嵌入
- 无框架依赖
- 支持对话 UI、loading、气泡展示

### AWS Lambda 后端

- 冷启动快、成本低、零运维
- 输入协议统一化
- 错误分类清晰
- 可扩展 service/provider 架构

### OpenAI Provider

- 统一封装调用
- 适配未来替换模型（Claude、DeepSeek）

## 4 Architecture Canvas

## 5 Input / Output Protocol（输入输出协议）

## 6 Directory

## 7 How to Run

### ▶ 前端

```
npx http-server
```

访问

```
http://localhost:8080/02src/01_frontend/chat_widget/index.html
```

### ▶ 本地测试 Lambda

```
node test_lambda.js
```

### ▶ 部署 Lambda

```
node build.js
aws lambda update-function-code \
  --function-name AstraChatHandler \
  --zip-file fileb://lambda.zip
```