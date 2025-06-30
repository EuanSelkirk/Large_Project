import React, { useEffect, useRef } from "react";

type Props = {
  code: string;
};

const LivePreview: React.FC<Props> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const html = `
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      try {
        ${code}
      } catch (err) {
        document.body.innerHTML = '<pre style="color: red;">' + err + '</pre>';
      }
    </script>
  </body>
</html>
`;

    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;
    }
  }, [code]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border bg-white"
      title="Live Preview"
      sandbox="allow-scripts allow-same-origin"
    />
  );
};

export default LivePreview;
