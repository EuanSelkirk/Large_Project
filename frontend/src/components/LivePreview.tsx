import React, { useEffect, useRef, useImperativeHandle, useState } from "react";

type Props = {
  html: string;
  css?: string;
};

const LivePreview = React.forwardRef<HTMLIFrameElement, Props>(
  ({ html, css = "" }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useImperativeHandle(ref, () => iframeRef.current!);

    // on mount + resize, recompute the scale so the sheet fits its wrapper
    useEffect(() => {
      const updateScale = () => {
        if (!wrapperRef.current || !sheetRef.current) return;
        const wrap = wrapperRef.current.getBoundingClientRect();
        const sheet = sheetRef.current.getBoundingClientRect();
        const factor = Math.min(
          wrap.width / sheet.width,
          wrap.height / sheet.height,
          1
        );
        setScale(factor);
      };

      updateScale();
      window.addEventListener("resize", updateScale);
      return () => window.removeEventListener("resize", updateScale);
    }, []);

    // rebuild the iframe contents when html/css change
    useEffect(() => {
      const fullHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      @page { size: A4 portrait; margin: 0; }
      .resume-sheet {
        width: 210mm;
        min-height: 297mm;
        box-sizing: border-box;
        padding: 20mm;
        background: white;
      }
      ${css}
    </style>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div class="resume-sheet"><div id="root"></div></div>
    <script type="text/babel">
      try {
        ${html}
      } catch (err) {
        document.body.innerHTML = '<pre style="color:red;">'+err+'</pre>';
      }
    </script>
  </body>
</html>`;
      if (iframeRef.current) {
        iframeRef.current.srcdoc = fullHtml;
      }
    }, [html, css]);

    return (
      <div
        ref={wrapperRef}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
          background: "#1e1e1e",
        }}
      >
        <div
          ref={sheetRef}
          style={{
            width: "210mm",
            height: "297mm",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <iframe
            ref={iframeRef}
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
            style={{
              width: "210mm",
              height: "297mm",
              border: "1px solid #ccc",
            }}
          />
        </div>
      </div>
    );
  }
);

export default LivePreview;
