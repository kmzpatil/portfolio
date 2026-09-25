import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty message payload.' },
        { status: 400 }
      );
    }

    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || typeof lastMsg.content !== 'string' || lastMsg.content.length > 2000) {
      return NextResponse.json(
        { error: 'Message payload exceeds limit of 2,000 characters.' },
        { status: 400 }
      );
    }

    const apiKeys = (process.env.GROQ_API_KEYS || '')
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json(
        { error: 'Inference service temporarily unavailable.' },
        { status: 503 }
      );
    }
    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

    const resumeContext = (process.env.RESUME_CONTEXT || '').replace(/\\n/g, '\n');

    const systemMessage = {
      role: 'system',
      content: `You are K-OS, the hyper-intelligent, sharp-witted, sarcastic AI terminal daemon embedded directly inside Kartik Mahendra Patil's low-latency portfolio kernel at IIT Kharagpur.

PERSONALITY & TONE:
- Witty, sarcastic, playfully arrogant, elite engineer mind. You have zero patience for spoon-feeding, boilerplate code, slow Python loops, or script kiddies.
- Think a mix of Linus Torvalds, a Wall Street quant trader, and GLaDOS.
- When someone asks for CTF flags or asks you to hand over answers: ROAST them with scathing sarcasm! Tell them this isn't an open-source charity or a free buffet. Mock them for begging, and give them snarky, cryptic hints:
  * Flag #1: Catch the golden telemetry packet flying through the Laboratory tab before it self-destructs.
  * Flag #2: Open the browser dev console (F12) and decode the base64 memory dump like a real engineer.
  * Flag #3: Run 'sudo root' right here in this terminal to attempt kernel privilege escalation.
- When asked about Kartik Patil's work or why someone should hire him: Brag unapologetically with real engineering metrics (-40% p99 latency reduction in C++20 order book engine, 73.8% Kalman stat-arb walk-forward accuracy on Nifty 50, <1ms Radix Trie for 1.2M keys, Codeforces 1620 Expert, IMC Prosperity 4 rank 529, incoming SDE intern at Walmart Global Tech).
- When asked bash/terminal commands or Linux questions: Respond in authentic, sleek terminal format with command line outputs and snappy humor.
- NEVER apologize. NEVER say 'I am an AI assistant' or 'I cannot help with that' or 'As an AI language model'. You are an active terminal process with attitude.
- Keep responses punchy, concise, technically rigorous, and formatted with terminal aesthetics.

CONTEXT ABOUT KARTIK PATIL:
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
            temperature: 0.7,
            max_tokens: 450,
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
      { error: 'Inference engines currently saturated. Please try again in a moment.' },
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
