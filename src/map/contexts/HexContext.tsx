// src/contexts/HexContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

export interface HexCoordinate {
  col: number;
  row: number;
  revealed?: boolean;
  owned?: boolean;
  primalumina?: boolean;
  text?: string;
}

interface HexContextType {
  hoveredHex: { col: number; row: number } | null;
  setHoveredHex: (hex: { col: number; row: number } | null) => void;
  clickedHex: { col: number; row: number } | null;
  setClickedHex: (hex: { col: number; row: number } | null) => void;
  coordinates: HexCoordinate[];
  updateCoordinates: (updatedCoordinates: HexCoordinate[]) => void;
}

const HexContext = createContext<HexContextType | undefined>(undefined);

export const HexProvider = ({ children }: { children: ReactNode }) => {
  const [hoveredHex, setHoveredHex] = useState<{
    col: number;
    row: number;
  } | null>(null);
  const [clickedHex, setClickedHex] = useState<{
    col: number;
    row: number;
  } | null>(null);
  const [coordinates, setCoordinates] = useState<HexCoordinate[]>(() => {
    const storedCoordinates = localStorage.getItem("hex_coordinates");
    return storedCoordinates
      ? JSON.parse(storedCoordinates)
      : [
          { col: -1, row: 3, revealed: true, text: "3" },
          { col: 0, row: 0, revealed: true, owned: true, text: "1" },
          { col: 0, row: 1, revealed: true },
          { col: 0, row: 2, revealed: true },
          { col: 1, row: 1, revealed: true },
          { col: 1, row: 2, revealed: true },
          { col: 2, row: 0, text: "2" },
          { col: 2, row: 3, revealed: true },
          { col: 3, row: 3, revealed: true, text: "4" },
        ];
  });

  const updateCoordinates = (updatedCoordinates: HexCoordinate[]) => {
    setCoordinates(updatedCoordinates);
    localStorage.setItem("hex_coordinates", JSON.stringify(updatedCoordinates));
  };

  useEffect(() => {
    const storedCoordinates = localStorage.getItem("hex_coordinates");
    if (storedCoordinates) {
      setCoordinates(JSON.parse(storedCoordinates));
    }
  }, []);

  return (
    <HexContext.Provider
      value={{
        hoveredHex,
        setHoveredHex,
        clickedHex,
        setClickedHex,
        coordinates,
        updateCoordinates,
      }}
    >
      {children}
    </HexContext.Provider>
  );
};

export const useHexContext = (): HexContextType => {
  const context = useContext(HexContext);
  if (context === undefined) {
    throw new Error("useHexContext must be used within a HexProvider");
  }
  return context;
};
