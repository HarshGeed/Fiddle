
"use client";
import { useState } from "react";

import { useHistory } from "../hooks/useHistory";
import Loader from "../components/Loader";
import ToneMatrix from "../components/ToneMatrix";
import TextEditorSkeleton from "../components/TextEditorSkeleton";

// Main page for the Tone Picker Tool

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

      // Handle tone change: call API and update text
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

      // Reset editor and error state
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-[80vw] h-[80vh] max-w-4xl max-h-[900px] bg-white rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left: Text Editor */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <label htmlFor="editor" className="mb-2 font-semibold text-gray-700 text-lg">Text Editor</label>
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 flex-1 flex flex-col">
            {loading ? (
              <TextEditorSkeleton />
            ) : (
              <textarea
                id="editor"
                className="flex-1 min-h-[220px] max-h-[400px] resize-none rounded-xl border-none outline-none text-lg md:text-xl bg-transparent placeholder-gray-400 transition-all text-black"
                value={text}
                onChange={e => setText(e.target.value)}
                disabled={loading}
                placeholder="Start typing your content..."
                spellCheck={true}
                autoFocus
              />
            )}
            {error && (
              <div className="mt-2 text-red-600 text-sm">{error}</div>
            )}
          </div>
        </div>
        {/* Right: Tone Picker Grid + Controls */}
        <div className="w-full md:w-1/2 p-4 flex flex-col items-center justify-center gap-6 border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50">
          <div className="flex flex-1 items-center justify-center w-full h-full">
            <ToneMatrix
              onSelect={tone => {
                if (!loading && text.trim()) handleTone(tone);
              }}
            />
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
        </div>
      </div>
    </main>
  );
}
