export function validateInput(body) {
  if (!body || typeof body.message !== "string" || body.message.trim() === "") {
    return "message 字段不能为空";
  }
  if (!body.session_id || typeof body.session_id !== "string") {
    return "session_id 必须为非空字符串";
  }
  return null; // 通过校验
}