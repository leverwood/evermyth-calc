// src/HexCoordinate.tsx
import React from "react";

interface HexCoordinateProps {
  x: number;
  y: number;
  text: string;
}

const HexCoordinate: React.FC<HexCoordinateProps> = ({ x, y, text }) => {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      alignmentBaseline="middle"
      fontSize="14"
      fill="black"
    >
      {text}
    </text>
  );
};

export default HexCoordinate;
