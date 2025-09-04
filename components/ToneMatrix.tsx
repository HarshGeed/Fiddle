import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";

type ToneMatrixProps = {
  onSelect: (tone: string) => void;
};

export default function ToneMatrix({ onSelect }: ToneMatrixProps) {
  const ROW_TONES = ["Professional", "Neutral", "Casual"];
  const COL_TONES = ["Concise", "Neutral", "Expanded"];

  const gridRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Responsive grid size
  const [gridSize, setGridSize] = useState(192);
  const DOT_SIZE = 20;
  const CELL_SIZE = gridSize / 3;

  useEffect(() => {
    function updateSize() {
      if (gridRef.current) {
        setGridSize(gridRef.current.offsetWidth);
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const [selected, setSelected] = useState<[number, number]>([1, 1]);

  // Initialize dot in center
  const [dotPos, setDotPos] = useState<{ x: number; y: number }>({
    x: CELL_SIZE * 1 + CELL_SIZE / 2 - DOT_SIZE / 2,
    y: CELL_SIZE * 1 + CELL_SIZE / 2 - DOT_SIZE / 2,
  });

  const getTone = (row: number, col: number) => {
    if (row === 1 && col === 1) return "Neutral";
    return `${ROW_TONES[row]} + ${COL_TONES[col]}`;
  };

  // Update dot position when selected or grid size changes
  useEffect(() => {
    setDotPos({
      x: selected[1] * CELL_SIZE + CELL_SIZE / 2 - DOT_SIZE / 2,
      y: selected[0] * CELL_SIZE + CELL_SIZE / 2 - DOT_SIZE / 2,
    });
  }, [selected, CELL_SIZE]);

  const handleStop = (e: any, data: any) => {
    const row = Math.min(2, Math.max(0, Math.floor((data.y + DOT_SIZE / 2) / CELL_SIZE)));
    const col = Math.min(2, Math.max(0, Math.floor((data.x + DOT_SIZE / 2) / CELL_SIZE)));
    setSelected([row, col]);
    onSelect(getTone(row, col));
    setDotPos({
      x: col * CELL_SIZE + CELL_SIZE / 2 - DOT_SIZE / 2,
      y: row * CELL_SIZE + CELL_SIZE / 2 - DOT_SIZE / 2,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Top label */}
      <div className="flex justify-center mb-2 h-5">
        <span className="text-xs font-medium text-gray-500">Professional</span>
      </div>

      <div className="flex flex-row items-center justify-center">
        {/* Left label */}
        <div className="flex flex-col justify-center h-48">
          <span className="text-xs font-medium text-gray-500 self-center -rotate-90">
            Concise
          </span>
        </div>

        {/* Grid container */}
        <div
          ref={gridRef}
          className="relative grid grid-cols-3 gap-1 w-32 h-32 sm:w-48 sm:h-48 bg-transparent"
        >
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <button
                key={`${row}-${col}`}
                className="bg-gray-100 border border-gray-300 rounded-lg w-full h-full focus:outline-none"
                style={{ touchAction: "manipulation" }}
                tabIndex={0}
                aria-label={getTone(row, col)}
                onClick={() => {
                  setSelected([row, col]);
                  onSelect(getTone(row, col));
                }}
              />
            ))
          )}

          {/* Draggable dot */}
          <Draggable
            nodeRef={dotRef}
            bounds="parent"
            position={dotPos}
            onDrag={(e, data) => setDotPos({ x: data.x, y: data.y })}
            onStop={handleStop}
          >
            <div
              ref={dotRef}
              className="absolute z-10 w-5 h-5 rounded-full bg-orange-500 ring-2 ring-white cursor-grab active:cursor-grabbing"
            />
          </Draggable>
        </div>

        {/* Right label */}
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
