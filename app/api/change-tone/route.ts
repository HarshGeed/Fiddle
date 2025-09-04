// Next.js API route to call Mistral AI and return rewritten text in the selected tone
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { text, tone } = await req.json();
    if (!text || !tone) {
      // Validate input
      return NextResponse.json(
        { error: "Missing text or tone." },
        { status: 400 }
      );
    }
    // Get API key from environment
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Mistral API key." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a text-rewriting assistant. 
Rewrite the user's text strictly in the requested tone. 
DO NOT add greetings, commentary, explanations, notes, or multiple options. 
Return only a single rewritten sentence or paragraph. And consider this as a new message`;

    const userPrompt = `Rewrite the following text in a ${tone} tone. 
Output ONLY the rewritten sentence(s) exactly as it should appear. 
Original text: "${text}"`;
    // Call Mistral API
    const mistralRes = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistral-small",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      }
    );
    // Handle API errors
    if (!mistralRes.ok) {
      const err = await mistralRes.text();
      return NextResponse.json(
        { error: `Mistral API error: ${err}` },
        { status: 500 }
      );
    }
    // Parse response
    const data = await mistralRes.json();
    let newText = data.choices?.[0]?.message?.content.trim();
    if (!newText) {
      return NextResponse.json(
        { error: "Invalid response from Mistral API." },
        { status: 500 }
      );
    }

     // --- POST-PROCESSING ---
     //Extract content inside quotes after "Rewritten sentence(s):"
const match = newText.match(/Rewritten sentence\(s\):\s*"([^"]+)"/);
if (match && match[1]) {
  newText = match[1];
}
    // Remove enclosing double quotes
    newText = newText.replace(/^"(.*)"$/, "$1");
    // Remove trailing parentheses commentary
    newText = newText.replace(/\s*\([^)]+\)\s*$/, "");
    // Remove any backslash (\) or forward slash (/) and everything after it
    newText = newText.replace(/[\\/].*$/, "");
    // Remove any "Note:" and everything after it
    newText = newText.replace(/\s*Note:.*$/, "");

    // Return transformed text
    return NextResponse.json({ newText: newText.trim() });
  } catch (e: any) {
    // Handle unexpected errors
    return NextResponse.json(
      { error: e.message || "Unknown error." },
      { status: 500 }
    );
  }
}
