import React, { useRef, useEffect, useState } from "react";

const MarqueeSpan = ({ children }) => {
  const containerRef = useRef(null);
  const spanRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (containerRef.current && spanRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const spanWidth = spanRef.current.scrollWidth;
      // Nếu nội dung vượt quá 90% chiều rộng của container thì bật marquee
      if (spanWidth > containerWidth * 0.9) {
        setAnimate(true);
      } else {
        setAnimate(false);
      }
    }
  }, [children]);

  return (
    <div ref={containerRef} className="w-[90%] overflow-hidden">
      <span
        ref={spanRef}
        className={`text-2xl font-bold hover:underline hover:cursor-pointer inline-block whitespace-nowrap 
        ${animate ? "animate-marquee max-w-[90%]" : ""}`}
      >
        {children}
      </span>
    </div>
  );
};

export default MarqueeSpan;
