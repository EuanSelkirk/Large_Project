import React from "react";
import { compile, Tailwind } from "@fileforge/react-print";
import html2pdf from "html2pdf.js";

type Props = {
  code: string;
};

const DownloadButton: React.FC<Props> = ({ code }) => {
  const handleDownload = async () => {
    const template = `
      ReactDOM.render(
        ${code},
        document.getElementById('root')
      );
    `;

    const html = await compile(
      <Tailwind>
        <div id="root">
          <script type="text/babel">{template}</script>
        </div>
      </Tailwind>
    );

    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.position = "absolute";
    container.style.top = "-9999px";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    await html2pdf().from(container).save("resume.pdf");

    document.body.removeChild(container);
  };

  return (
    <div className="p-2 border-t bg-gray-100">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleDownload}
      >
        Download as PDF
      </button>
    </div>
  );
};

export default DownloadButton;
