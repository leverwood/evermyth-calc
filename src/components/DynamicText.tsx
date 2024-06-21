// DynamicText.tsx
import React, { useRef, useState, useEffect } from "react";

interface DynamicTextProps {
  className?: string;
  children: React.ReactNode;
}

const DynamicText = ({ className, children }: DynamicTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number>(16);

  // reset font size if children change
  useEffect(() => {
    setFontSize(16);
  }, [children]);

  useEffect(() => {
    console.log("Resizing text");
    const currentTextRef = textRef.current;
    const resizeText = () => {
      if (!currentTextRef) return;
      const { clientHeight, scrollHeight } = textRef.current;

      if (scrollHeight > clientHeight) {
        setFontSize((prevFontSize) => {
          console.log(`Decreasing font size to ${prevFontSize - 1}`);
          return prevFontSize - 1;
        });
      } else if (scrollHeight + 30 < clientHeight) {
        setFontSize((prevFontSize) => {
          console.log(`Increasing font size to ${prevFontSize + 1}`);
          return prevFontSize + 1;
        });
      }
    };

    const observer = new ResizeObserver(resizeText);
    if (currentTextRef) observer.observe(currentTextRef);

    resizeText();

    return () => {
      if (currentTextRef) observer.unobserve(currentTextRef);
    };
  }, [fontSize]);

  return (
    <div
      ref={textRef}
      className={className}
      style={{ fontSize, overflow: "scroll" }}
    >
      {children}
    </div>
  );
};

export default DynamicText;
