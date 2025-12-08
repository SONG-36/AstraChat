/**
 * 成功返回结构
 */
export function successResponse(replyText, meta = {}) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      data: {
        reply: replyText,
      },
      meta,
    }),
  };
}

/**
 * 错误返回结构
 */
export function errorResponse(errorObj, meta = {}) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      ok: false,
      error: {
        type: errorObj?.errorType || 'unknown',       // ←修复：使用 errorType
        retryAfter: errorObj?.retryAfter || null,
        message: errorObj?.message || 'Unexpected error',
      },
      meta,
    }),
  };
}
