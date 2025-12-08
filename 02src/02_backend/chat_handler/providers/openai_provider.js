import {OpenAIErrorTypes} from "./openai_errors.js"

const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

export async function callOpenAI({ systemPrompt, userPrompt}) {
    if (!API_KEY) {
        throw {
            type: OpenAIErrorTypes.AUTH,
            message: "API key missing"
        };
    }

    if (!userPrompt || typeof userPrompt !== 'string') {
        throw {
            type: OpenAIErrorTypes.UNKNOWN,
            message: "userPrompt must be a non-empty string"
        };
    }

    const url = `${BASE_URL}/chat/completions`;

    const body = {
        model: MODEL,
        messages: [
        ...(systemPrompt
            ? [{ role: 'system', content: systemPrompt }]
            : []),
        { role: 'user', content: userPrompt },
        ],
    };

    let res;
    try {
        res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_KEY}`,
                },
                body: JSON.stringify(body),
            });
    } catch(networkErr) {
        //网络级错误
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

    // ---------- Error Classification ----------
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
            status:429,
            retryAfter:json?.error?.retry_after || 2,
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

    //---------- Success ----------
    const text = json.choices?.[0]?.message?.content;
    if(!text) {
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