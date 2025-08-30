import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, tone } = await req.json();
    if (!text || !tone) {
      return NextResponse.json({ error: "Missing text or tone." }, { status: 400 });
    }
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Mistral API key." }, { status: 500 });
    }
    const systemPrompt = `Rewrite the text in a ${tone} tone.`;
    const mistralRes = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });
    if (!mistralRes.ok) {
      const err = await mistralRes.text();
      return NextResponse.json({ error: `Mistral API error: ${err}` }, { status: 500 });
    }
    const data = await mistralRes.json();
    const newText = data.choices?.[0]?.message?.content;
    if (!newText) {
      return NextResponse.json({ error: "Invalid response from Mistral API." }, { status: 500 });
    }
    return NextResponse.json({ newText });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error." }, { status: 500 });
  }
}
