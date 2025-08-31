// Next.js API route to call Mistral AI and return rewritten text in the selected tone
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { text, tone } = await req.json();
    if (!text || !tone) {
      // Validate input
      return NextResponse.json({ error: "Missing text or tone." }, { status: 400 });
    }
    // Get API key from environment
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Mistral API key." }, { status: 500 });
    }
    // Build system prompt for Mistral
    const systemPrompt = `Rewrite the text in a ${tone} tone.`;
    // Call Mistral API
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
    // Handle API errors
    if (!mistralRes.ok) {
      const err = await mistralRes.text();
      return NextResponse.json({ error: `Mistral API error: ${err}` }, { status: 500 });
    }
    // Parse response
    const data = await mistralRes.json();
    const newText = data.choices?.[0]?.message?.content;
    if (!newText) {
      return NextResponse.json({ error: "Invalid response from Mistral API." }, { status: 500 });
    }
    // Return transformed text
    return NextResponse.json({ newText });
  } catch (e: any) {
    // Handle unexpected errors
    return NextResponse.json({ error: e.message || "Unknown error." }, { status: 500 });
  }
}
