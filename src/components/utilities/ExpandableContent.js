import React, { useState, useEffect } from "react";
import { useCallback } from "react";

const ExpandableContent = ({ children, expand }) => {
  const [contentHeight, setContentHeight] = useState(expand ? "auto" : 0);
  const contentRef = React.createRef();

  const handleResize = useCallback(() => {
    if (expand) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height || 0);
    }
  }, [expand, contentRef]);

  useEffect(() => {
    const height = contentRef.current.scrollHeight;
    setContentHeight(height || 0);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [contentRef, handleResize]);

  return (
    <div
      className="expandable-content"
      ref={contentRef}
      style={{
        maxHeight: expand ? `${contentHeight}px` : 0,
        overflow: "hidden",
        transition: "max-height 0.3s ease-in-out",
      }}
    >
      {children}
    </div>
  );
};

export default ExpandableContent;
