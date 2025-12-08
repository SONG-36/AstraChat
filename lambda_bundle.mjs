// 02src/02_backend/chat_handler/providers/openai_errors.js
var OpenAIErrorTypes = {
  AUTH: "auth_error",
  RATE_LIMIT: "rate_limit",
  SERVER: "server_error",
  NETWORK: "network_error",
  UNKONWN: "unknown_error"
};

// 02src/02_backend/chat_handler/providers/openai_provider.js
var API_KEY = process.env.OPENAI_API_KEY;
var MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
var BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
async function callOpenAI({ systemPrompt, userPrompt }) {
  if (!API_KEY) {
    throw {
      type: OpenAIErrorTypes.AUTH,
      message: "API key missing"
    };
  }
  if (!userPrompt || typeof userPrompt !== "string") {
    throw {
      type: OpenAIErrorTypes.UNKNOWN,
      message: "userPrompt must be a non-empty string"
    };
  }
  const url = `${BASE_URL}/chat/completions`;
  const body = {
    model: MODEL,
    messages: [
      ...systemPrompt ? [{ role: "system", content: systemPrompt }] : [],
      { role: "user", content: userPrompt }
    ]
  };
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    });
  } catch (networkErr) {
    throw {
      type: OpenAIErrorTypes.NETWORK,
      message: "Network request failed",
      raw: networkErr
    };
  }
  let json;
  try {
    json = await res.json;
  } catch (parseErr) {
    throw {
      type: OpenAIErrorTypes.SERVER,
      message: "Invalid JSON from OpenAI",
      raw: parseErr
    };
  }
  if (res.status === 401 || res.status === 403) {
    throw {
      type: OpenAIErrorTypes.AUTH,
      status: res.status,
      message: "Invalid API key or insufficient permissions",
      raw: json
    };
  }
  if (res.status === 429) {
    throw {
      type: OpenAIErrorTypes.RATE_LIMIT,
      status: 429,
      retryAfter: json?.error?.retry_after || 2,
      message: "Rate limit exceeded",
      raw: json
    };
  }
  if (res.status >= 500) {
    throw {
      type: OpenAIErrorTypes.SERVER,
      status: res.status,
      message: "OpenAI server error",
      raw: json
    };
  }
  if (!res.ok) {
    throw {
      type: OpenAIErrorTypes.UNKNOWN,
      status: res.status,
      message: "Unexpected API error",
      raw: json
    };
  }
  const text = json.choices?.[0]?.message?.content;
  if (!text) {
    throw {
      type: OpenAIErrorTypes.SERVER,
      message: "Empty response from OpenAI",
      raw: json
    };
  }
  return {
    text,
    model: MODEL,
    usage: json.usage
  };
}

// 02src/02_backend/chat_handler/services/llm_client.js
async function simpleChat(userMessage) {
  const systemPrompt = "You are a helpful assistant for AWS + AI learning. Answer briefly in Chinese unless the user asks otherwise.";
  try {
    console.log("CALLING callOpenAI NOW...");
    const replyText = await callOpenAI({
      systemPrompt,
      userPrompt: userMessage
    });
    return {
      ok: true,
      replyText
    };
  } catch (err) {
    console.log("ERROR CAUGHT IN simpleChat:", err);
    const errorType = err?.type || "unknown";
    const retryAfter = err?.retryAfter || null;
    return {
      ok: false,
      errorType,
      retryAfter,
      message: err.message
    };
  }
}

// 02src/02_backend/chat_handler/handler/response_builder.js
function successResponse(replyText, meta = {}) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      data: {
        reply: replyText
      },
      meta
    })
  };
}
function errorResponse(errorObj, meta = {}) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      ok: false,
      error: {
        type: errorObj?.errorType || "unknown",
        // ←修复：使用 errorType
        retryAfter: errorObj?.retryAfter || null,
        message: errorObj?.message || "Unexpected error"
      },
      meta
    })
  };
}

// 02src/02_backend/chat_handler/handler/index.js
var handler = async (event) => {
  try {
    let body = {};
    if (event?.body) {
      body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    }
    const userMessage = body.message || "";
    if (!userMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          error: { type: "bad_request", message: "message is required" },
          meta: {}
        })
      };
    }
    const result = await simpleChat(userMessage);
    if (!result.ok) {
      return errorResponse(
        {
          errorType: result.errorType,
          retryAfter: result.retryAfter,
          message: result.message
        },
        {
          provider: "openai"
        }
      );
    }
    return successResponse(result.replyText, {
      provider: "openai",
      model: "gpt-4.1-mini"
    });
  } catch (err) {
    console.error("[handler] fatal error:", err);
    return errorResponse(
      { errorType: "internal_error", message: err.message },
      { provider: "unknown" }
    );
  }
};
export {
  handler
};
