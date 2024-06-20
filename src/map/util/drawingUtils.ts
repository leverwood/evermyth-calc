const DEBUG_MODE = false;

const drawHex = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hexSize: number
) => {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i; // No rotation needed for flat-topped hexagons
    const x_i = x + hexSize * Math.cos(angle);
    const y_i = y + hexSize * Math.sin(angle);
    ctx.lineTo(x_i, y_i);
  }
  ctx.closePath();
};

export const drawRevealedHex = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hexSize: number,
  owned: boolean
) => {
  ctx.beginPath();
  // Set the fill color to white, but with half opacity
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i; // No rotation needed for flat-topped hexagons
    const x_i = x + hexSize * Math.cos(angle);
    const y_i = y + hexSize * Math.sin(angle);
    ctx.lineTo(x_i, y_i);
  }
  ctx.closePath();
  if (owned) {
    // opaque purple fill
    ctx.fillStyle = "rgba(128, 0, 128, .25)";
    ctx.fill();
    ctx.strokeStyle = "rgba(128, 0, 128, 1)";
    ctx.stroke();
  } else {
    if (DEBUG_MODE) {
      ctx.strokeStyle = "rgba(0, 0, 0, 1)";
      ctx.stroke();
    }
  }
};

export const fillInHex = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hexSize: number
) => {
  // Set the fill color to white, but with half opacity
  drawHex(ctx, x, y, hexSize);
  ctx.fillStyle = DEBUG_MODE
    ? "rgba(255, 255, 255, 0.5)"
    : "rgba(255, 255, 255, 1)";
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 0, 0, .1)";
  ctx.stroke();
};

export const drawHexHighlight = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hexSize: number
) => {
  drawHex(ctx, x, y, hexSize);
  // Set the fill color to yellow, but with half opacity
  ctx.fillStyle = "rgba(255, 255, 0, 0.1)";
  ctx.fill();
};

export const drawHexOutline = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hexSize: number
) => {
  drawHex(ctx, x, y, hexSize);
  // Set the fill color to yellow, but with half opacity
  ctx.strokeStyle = "red";
  ctx.stroke();
};

export const drawHexCoordinates = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  col: number,
  row: number,
  hexSize: number
) => {
  ctx.font = "10px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const text = `(${col}, ${row})`;
  ctx.fillStyle = "black";
  if (DEBUG_MODE) {
    ctx.fillText(text, x, y + hexSize / 2);
  }
};

export const drawText = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hexSize: number,
  text: string
) => {
  const circleY = y + hexSize / 3; // Keep the y-coordinate the same for both circle and text
  const radius = hexSize / 3;

  // Draw the circle
  ctx.beginPath();
  ctx.arc(x, circleY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.stroke();

  // Draw the text
  ctx.fillStyle = "black";
  ctx.font = `bold ${radius}px Arial`; // Adjust the font size to the radius of the circle
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x - 0.5, circleY + 0.5);
};

export const drawImageOnLoad = (
  ctx: CanvasRenderingContext2D,
  image: {
    url: string;
    width: number;
    height: number;
    offsetX?: number;
    offsetY?: number;
  },
  centerX: number,
  centerY: number,
  callback: () => void
) => {
  const img = new Image();
  img.src = image.url;
  img.onload = () => {
    const imgX = centerX - image.width / 2 + (image.offsetX || 0);
    const imgY = centerY - image.height / 2 + (image.offsetY || 0);
    ctx.drawImage(img, imgX, imgY, image.width, image.height);
    callback();
  };
};
