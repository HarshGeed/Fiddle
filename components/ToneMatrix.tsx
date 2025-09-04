import React, { useState, useRef } from "react";

type ToneMatrixProps = {
  onSelect: (tone: string) => void;
};

export default function ToneMatrix({ onSelect }: ToneMatrixProps) {
  const ROW_TONES = ["Professional", "Neutral", "Casual"];
  const COL_TONES = ["Concise", "Neutral", "Expanded"];

  const gridRef = useRef<HTMLDivElement>(null);

  // selected cell [row, col]
  const [selected, setSelected] = useState<[number, number] | null>([1, 1]);
  // draggable dot position
  const [dotPos, setDotPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [dragging, setDragging] = useState(false);

  const getTone = (row: number, col: number) => {
    if (row === 1 && col === 1) return "Neutral";
    return `${ROW_TONES[row]} + ${COL_TONES[col]}`;
  };

  // Initialize dot position after mount
  React.useEffect(() => {
    if (gridRef.current && selected) {
      const grid = gridRef.current.getBoundingClientRect();
      const cellSize = grid.width / 3;
      setDotPos({
        x: selected[1] * cellSize + cellSize / 2,
        y: selected[0] * cellSize + cellSize / 2,
      });
    }
  }, [selected]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    e.stopPropagation();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !gridRef.current) return;
    const grid = gridRef.current.getBoundingClientRect();
    let x = e.clientX - grid.left;
    let y = e.clientY - grid.top;

    // clamp inside grid
    x = Math.max(0, Math.min(x, grid.width));
    y = Math.max(0, Math.min(y, grid.height));

    setDotPos({ x, y });
  };

  const handleMouseUp = () => {
    if (!dragging || !gridRef.current) return;
    setDragging(false);

    const grid = gridRef.current.getBoundingClientRect();
    const cellSize = grid.width / 3;
    const row = Math.min(2, Math.max(0, Math.floor(dotPos.y / cellSize)));
    const col = Math.min(2, Math.max(0, Math.floor(dotPos.x / cellSize)));

    setSelected([row, col]);
    onSelect(getTone(row, col));

    setDotPos({
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
    });
  };

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

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
          className="relative grid grid-cols-3 gap-1 w-48 h-48 bg-transparent"
        >
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <div
                key={`${row}-${col}`}
                className="bg-gray-100 border border-gray-300 rounded-lg w-full h-full"
              />
            ))
          )}

          {/* Draggable orange dot */}
          {selected && (
            <div
              onMouseDown={handleMouseDown}
              className="absolute w-5 h-5 rounded-full bg-orange-500 ring-2 ring-white cursor-grab active:cursor-grabbing"
              style={{
                left: dotPos.x - 10,
                top: dotPos.y - 10,
                transition: dragging ? "none" : "0.2s",
              }}
            />
          )}
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
