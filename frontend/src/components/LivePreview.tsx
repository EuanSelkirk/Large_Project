import React, { useEffect, useRef, useImperativeHandle } from "react";

type Props = {
  code: string;
  css?: string;
};

const LivePreview = React.forwardRef<HTMLIFrameElement, Props>(
  ({ code, css = "" }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useImperativeHandle(
      ref,
      () => {
        return iframeRef.current!;
      },
      []
    );

    useEffect(() => {
      const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      /* set page to A4, no default margin */
      @page { size: A4 portrait; margin: 0; }

      /* your “sheet” that html2pdf will snap */
      .resume-sheet {
        width: 210mm;
        min-height: 297mm;
        box-sizing: border-box;
        padding: 20mm;        /* your desired print margins */
        background: white;
      }

      /* user’s custom CSS */
      ${css}
    </style>

    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <!-- wrap everything in the printable sheet -->
    <div class="resume-sheet">
      <div id="root"></div>
    </div>

    <script type="text/babel">
      try {
        ${code}
      } catch (err) {
        document.body.innerHTML =
          '<pre style="color: red;">' + err + '</pre>';
      }
    </script>
  </body>
</html>
`;
      if (iframeRef.current) {
        iframeRef.current.srcdoc = html;
      }
    }, [code, css]);

    return (
      <iframe
        ref={iframeRef}
        title="Live Preview"
        sandbox="allow-scripts allow-same-origin"
        style={{ width: "100%", height: "100%", border: "1px solid #ccc" }}
      />
    );
  }
);

export default LivePreview;
