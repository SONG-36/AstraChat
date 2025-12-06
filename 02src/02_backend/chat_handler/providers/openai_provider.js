import 'dotenv/config';

const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

export async function callopenAI({ systemPrompt, userPrompt}) {
    if (!API_KEY) {
        throw new Error('[callOpenAI] OPENAI_API_KEY is not set in .env');
    }
    if (!userPrompt || typeof userPrompt !== 'string') {
        throw new Error('[callOpenAI] userPrompt must be a non-empty string');
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

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(body),
    });

    const json = await res.json;

    //v0 文本读取
    if (!res.ok) {
        console.error('[callOpenAI] OpenAI API error:', json);
        throw new Error(`[callOpenAI] HTTP ${res.status}`);
    }

    const text = json.choices?.[0]?.message?.content;
    if (!text) {
        throw new Error('[callOpenAI] Empty response from OpenAI');
    }

    return text;
}