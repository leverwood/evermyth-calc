export const getHexAtMousePosition = (
  canvas: HTMLCanvasElement,
  mouseX: number,
  mouseY: number,
  hexSize: number
): { col: number; row: number } => {
  const rect = canvas.getBoundingClientRect();
  const x = mouseX - rect.left;
  const y = mouseY - rect.top;

  const hexWidth = 2 * hexSize;
  const hexHeight = Math.sqrt(3) * hexSize;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Calculate column and row in a flat-topped hex grid
  const col = Math.round((x - centerX) / (hexWidth * 0.75));
  const row = Math.round(
    (y - centerY - (col % 2) * (hexHeight / 2)) / hexHeight
  );

  return { col, row };
};


export const getHexCoordsToXY = (
  canvas: HTMLCanvasElement,
  col: number,
  row: number,
  hexSize: number
): { x: number; y: number } => {
  const hexWidth = 2 * hexSize;
  const hexHeight = Math.sqrt(3) * hexSize;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const x = centerX + col * (hexWidth * 0.75);
  const y = centerY + row * hexHeight + (col % 2) * (hexHeight / 2);

  return { x, y };
};