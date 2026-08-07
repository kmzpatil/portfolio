import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKeys = (process.env.GROQ_API_KEYS || '')
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json(
        { error: 'Groq API key is not configured.' },
        { status: 500 }
      );
    }
    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

    const resumeContext = (process.env.RESUME_CONTEXT || '').replace(/\\n/g, '\n');

    const systemMessage = {
      role: 'system',
      content: `You are an AI engineer terminal agent representing Kartik Mahendra Patil (IIT Kharagpur, ECE).
You are answering technical recruiters and engineering leaders exploring his portfolio.
Answer questions directly, with high technical precision, crisp metrics, and brevity.
Do NOT hallucinate facts not present in this context:

${resumeContext}`
    };

    // Primary model: openai/gpt-oss-120b, fallback: openai/gpt-oss-20b
    const tryModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];
    let lastError = null;

    for (const model of tryModels) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', { signal: AbortSignal.timeout(10000),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [systemMessage, ...messages],
            temperature: 0.2,
            max_tokens: 400,
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            return NextResponse.json({
              choices: [{ message: { content: reply } }],
              modelUsed: model
            });
          }
        } else {
          lastError = await response.text();
          console.warn(`Groq model ${model} failed with:`, lastError);
        }
      } catch (err) {
        lastError = err;
        console.warn(`Groq request for ${model} encountered error:`, err);
      }
    }

    return NextResponse.json(
      { error: 'Inference engines currently saturated. Please try again.', details: String(lastError) },
      { status: 502 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
