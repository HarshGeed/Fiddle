import React, { useState } from "react";

const TONE_MATRIX = [
  ["", "Professional", ""],
  ["Concise", "", "Expanded"],
  ["", "Casual", ""],
];

// Map cell positions to tone names
const TONE_NAMES = [
  ["Top-Left", "Professional", "Top-Right"],
  ["Concise", "Neutral", "Expanded"],
  ["Bottom-Left", "Casual", "Bottom-Right"],
];

type ToneMatrixProps = {
  onSelect: (tone: string) => void;
};

export default function ToneMatrix({ onSelect }: ToneMatrixProps) {
  // selected: [row, col]
  const [selected, setSelected] = useState<[number, number] | null>(null);

  // Helper to get tone name for a cell
  const getTone = (row: number, col: number) => TONE_NAMES[row][col];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Top label */}
      <div className="flex justify-center mb-1 h-5">
        <span className="text-xs font-medium text-gray-500">
          Professional
        </span>
      </div>
      <div className="flex flex-row items-center justify-center">
        {/* Left label */}
        <div className="flex flex-col justify-center mr-1 h-48">
          <span className="text-xs font-medium text-gray-500 self-center">
            Concise
          </span>
        </div>
        {/* Matrix */}
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
                {selected &&
                  selected[0] === row &&
                  selected[1] === col && (
                    <span className="absolute w-5 h-5 rounded-full bg-orange-500 ring-2 ring-white transition-all"></span>
                  )}
              </button>
            ))
          )}
        </div>
        {/* Right label */}
        <div className="flex flex-col justify-center ml-1 h-48">
          <span className="text-xs font-medium text-gray-500 self-center">
            Expanded
          </span>
        </div>
      </div>
      {/* Bottom label */}
      <div className="flex justify-center mt-1 h-5">
        <span className="text-xs font-medium text-gray-500">
          Casual
        </span>
      </div>
    </div>
  );
}