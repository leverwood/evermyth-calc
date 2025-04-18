import React, { useRef, useState, useEffect } from "react";

interface DynamicTextProps {
  className?: string;
  children: React.ReactNode;
  maxFontSize?: number;
  height?: number;
}

const DynamicText = ({
  className,
  children,
  maxFontSize = 16,
  height,
}: DynamicTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number>(maxFontSize);

  // reset font size if children change
  useEffect(() => {
    setFontSize(maxFontSize);
  }, [children, maxFontSize]);

  useEffect(() => {
    const currentTextRef = textRef.current;
    const resizeText = () => {
      if (!currentTextRef) return;
      const { clientHeight, scrollHeight } = textRef.current as HTMLElement;

      if (scrollHeight > clientHeight) {
        console.log(
          `Decreasing font size to ${fontSize - 1}, currently ${fontSize}`,
          currentTextRef
        );
        setFontSize((prevFontSize) => {
          return prevFontSize - 1;
        });
      }
    };

    const observer = new ResizeObserver(resizeText);
    if (currentTextRef) observer.observe(currentTextRef);

    resizeText();

    return () => {
      if (currentTextRef) observer.unobserve(currentTextRef);
    };
  }, [fontSize, maxFontSize]);

  return (
    <div
      ref={textRef}
      className={className}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: `${1.4 * fontSize}px`,
        overflow: "auto",
        height: height ? `${height}px` : "auto",
      }}
    >
      {children}
    </div>
  );
};

export default DynamicText;
