
"use client";
import { useState } from "react";
import { useHistory } from "../hooks/useHistory";
import Loader from "../components/Loader";

const TONES = [
  "Formal",
  "Casual",
  "Friendly",
  "Polite",
  "Concise",
  "Detailed",
  "Playful",
  "Professional",
  "Neutral",
];

export default function Home() {
  const {
    value: text,
    set: setText,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  } = useHistory("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTone(tone: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/change-tone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Unknown error");
      setText(data.newText);
    } catch (e: any) {
      setError(e.message || "Failed to change tone.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    reset("");
    setError(null);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left: Text Editor */}
        <div className="w-full md:w-1/2 p-4 flex flex-col">
          <label htmlFor="editor" className="mb-2 font-semibold text-gray-700">
            Text Editor
          </label>
          <textarea
            id="editor"
            className="flex-1 min-h-[200px] resize-none border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-100"
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={loading}
            placeholder="Type or paste your text here..."
          />
          {error && (
            <div className="mt-2 text-red-600 text-sm">{error}</div>
          )}
        </div>
        {/* Right: Tone Picker Grid + Controls */}
        <div className="w-full md:w-1/2 p-4 flex flex-col items-center gap-4 border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50">
          <div className="grid grid-cols-3 gap-2 w-full">
            {TONES.map(tone => (
              <button
                key={tone}
                className="py-2 px-2 bg-blue-100 hover:bg-blue-200 rounded font-medium text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                onClick={() => handleTone(tone)}
                disabled={loading || !text.trim()}
              >
                {tone}
              </button>
            ))}
          </div>
          <div className="flex gap-2 w-full justify-center mt-2">
            <button
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-medium text-xs md:text-sm"
              onClick={handleReset}
              disabled={loading || (!text && !canUndo && !canRedo)}
            >
              Reset
            </button>
            <button
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-medium text-xs md:text-sm"
              onClick={undo}
              disabled={!canUndo || loading}
            >
              Undo
            </button>
            <button
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-medium text-xs md:text-sm"
              onClick={redo}
              disabled={!canRedo || loading}
            >
              Redo
            </button>
          </div>
          {loading && <Loader />}
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-400 text-center">
        Tone Picker Tool &copy; {new Date().getFullYear()} | Powered by Mistral AI
      </div>
    </main>
  );
}
