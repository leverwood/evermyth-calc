import { useRef, useEffect } from "react";
import {
  drawRevealedHex,
  drawHexCoordinates,
  drawText,
  drawImageOnLoad,
  fillInHex,
  drawHexHighlight,
  drawHexOutline,
} from "../util/drawingUtils";
import {
  getHexAtMousePosition,
  getHexCoordsToXY,
} from "../util/interactionUtils";
import { HexCoordinate, useHexContext } from "../contexts/HexContext";

const HexGrid = ({
  width,
  height,
  hexSize,
  image,
}: {
  width: number;
  height: number;
  hexSize: number;
  image: {
    url: string;
    width: number;
    height: number;
    offsetX?: number;
    offsetY?: number;
  };
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { hoveredHex, setHoveredHex, clickedHex, setClickedHex, coordinates } =
    useHexContext();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hexWidth = 2 * hexSize;
    const hexHeight = Math.sqrt(3) * hexSize;

    const drawHexGrid = () => {
      // clear the whole grid
      // ctx.clearRect(0, 0, canvas.width, canvas.height);

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      // Draw background image
      drawImageOnLoad(ctx, image, centerX, centerY, () => {
        // Calculate the number of hexes to draw
        const cols = Math.ceil(canvasWidth / (hexWidth * 0.75));
        const rows = Math.ceil(canvasHeight / hexHeight);

        const loopHexes = (
          callback: ({
            x,
            y,
            col,
            row,
            coordData,
          }: {
            x: number;
            y: number;
            col: number;
            row: number;
            isHovered: boolean;
            coordData?: HexCoordinate;
          }) => void
        ) => {
          for (let row = -rows; row < rows; row++) {
            for (let col = -cols; col < cols; col++) {
              const { x, y } = getHexCoordsToXY(canvas, col, row, hexSize);
              const coordData = coordinates.find(
                ({ col: c, row: r }) => col === c && row === r
              );
              const isHovered =
                hoveredHex?.col === col && hoveredHex?.row === row;
              callback({ x, y, col, row, coordData, isHovered });
            }
          }
        };

        loopHexes(({ x, y, col, row, coordData }) => {
          // pass doFill as false when the coordinates are revealed
          if (!coordData?.revealed) {
            fillInHex(ctx, x, y, hexSize);
          }
          drawHexCoordinates(ctx, x, y, col, row, hexSize);
        });

        // draw revealed info
        loopHexes(({ x, y, col, row, coordData }) => {
          if (!coordData?.revealed) return;
          drawRevealedHex(ctx, x, y, hexSize, !!coordData.owned);

          drawHexCoordinates(ctx, x, y, col, row, hexSize);
        });

        // draw text
        loopHexes(({ x, y, col, row, coordData }) => {
          if (coordData?.text) {
            drawText(ctx, x, y, hexSize, coordData.text);
          }
        });

        if (hoveredHex) {
          const { x, y } = getHexCoordsToXY(
            canvas,
            hoveredHex.col,
            hoveredHex.row,
            hexSize
          );
          drawHexHighlight(ctx, x, y, hexSize);
        }

        if (clickedHex) {
          const { x, y } = getHexCoordsToXY(
            canvas,
            clickedHex.col,
            clickedHex.row,
            hexSize
          );
          drawHexOutline(ctx, x, y, hexSize);
        }
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const { col, row } = getHexAtMousePosition(
        canvas,
        event.clientX,
        event.clientY,
        hexSize
      );
      setHoveredHex({ col, row });
    };
    const handleMouseClick = (event: MouseEvent) => {
      const { col, row } = getHexAtMousePosition(
        canvas,
        event.clientX,
        event.clientY,
        hexSize
      );
      setClickedHex({ col, row });
    };
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleMouseClick);

    drawHexGrid();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleMouseClick);
    };
  }, [
    clickedHex,
    coordinates,
    hexSize,
    hoveredHex,
    image,
    setClickedHex,
    setHoveredHex,
  ]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default HexGrid;
