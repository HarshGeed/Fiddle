
// ToneMatrix: 3x3 grid selector for tone, with axis labels and pointer
import React, { useState } from "react";

// Props: onSelect callback receives the selected tone string
type ToneMatrixProps = {
  onSelect: (tone: string) => void;
};

export default function ToneMatrix({ onSelect }: ToneMatrixProps) {
  // Track selected cell as [row, col]
  const [selected, setSelected] = useState<[number, number] | null>(null);

  // Define axis tones for rows and columns
  const ROW_TONES = ["Professional", "Neutral", "Casual"];
  const COL_TONES = ["Concise", "Neutral", "Expanded"];

  // Compute the tone name for a given cell
  const getTone = (row: number, col: number) => {
    if (row === 1 && col === 1) return "Neutral"; // center cell
    return `${ROW_TONES[row]} + ${COL_TONES[col]}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Top label */}
      <div className="flex justify-center mb-2 h-5">
        <span className="text-xs font-medium text-gray-500">Professional</span>
      </div>
      <div className="flex flex-row items-center justify-center">
        {/* Left label (vertical) */}
        <div className="flex flex-col justify-center h-48">
          <span className="text-xs font-medium text-gray-500 self-center -rotate-90">
            Concise
          </span>
        </div>
        {/* 3x3 grid */}
        <div className="grid grid-cols-3 gap-1 w-48 h-48 bg-transparent">
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <button
                key={`${row}-${col}`}
                className="relative bg-gray-100 border border-gray-300 rounded-lg w-full h-full flex items-center justify-center transition-colors hover:bg-gray-200 focus:outline-none"
                style={{ aspectRatio: "1 / 1" }}
                onClick={() => {
                  setSelected([row, col]);
                  onSelect(getTone(row, col));
                }}
                aria-label={getTone(row, col)}
              >
                {/* Orange marker for selected cell */}
                {selected &&
                  selected[0] === row &&
                  selected[1] === col && (
                    <span className="absolute w-5 h-5 rounded-full bg-orange-500 ring-2 ring-white transition-all"></span>
                  )}
              </button>
            ))
          )}
        </div>
        {/* Right label (vertical) */}
        <div className="flex flex-col justify-center h-48">
          <span className="text-xs font-medium text-gray-500 self-center rotate-90">
            Expanded
          </span>
        </div>
      </div>
      {/* Bottom label */}
      <div className="flex justify-center mt-2 h-5">
        <span className="text-xs font-medium text-gray-500">Casual</span>
      </div>
    </div>
  );
}
