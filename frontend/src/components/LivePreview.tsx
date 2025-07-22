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

    useEffect(() => {
      const updateScale = () => {
        if (!wrapperRef.current || !sheetRef.current) return;
        const wrap = wrapperRef.current.getBoundingClientRect();
        const sheetWidth = sheetRef.current.scrollWidth;
        const factor = Math.min(wrap.width / sheetWidth, 1);
        setScale(Number(factor.toFixed(3)));
      };

      updateScale();
      window.addEventListener("resize", updateScale);
      const ro = new ResizeObserver(updateScale);
      if (wrapperRef.current) ro.observe(wrapperRef.current);

      return () => {
        window.removeEventListener("resize", updateScale);
        ro.disconnect();
      };
    }, []);

    useEffect(() => {
      const fullHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; }
      @page { size: A4 portrait; margin: 0; }
      .resume-sheet {
        width: 210mm;
        box-sizing: border-box;
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
      if (iframeRef.current) iframeRef.current.srcdoc = fullHtml;
    }, [html, css]);

    return (
      <div
        ref={wrapperRef}
        style={{
          width: "100%",
          height: "100%",
          overflowX: "hidden",
          overflowY: "auto",
          boxSizing: "border-box",
          background: "#1e1e1e",
        }}
      >
        <div
          ref={sheetRef}
          style={{
            width: "210mm",
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
              height: "auto",
              minHeight: "297mm",
            }}
          />
        </div>
      </div>
    );
  }
);

export default LivePreview;
