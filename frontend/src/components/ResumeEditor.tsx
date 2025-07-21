import Editor from "@monaco-editor/react";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  language?: string;
  label?: string;
};

const ResumeEditor: React.FC<Props> = ({
  code,
  setCode,
  language = "javascript",
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          defaultLanguage={language}
          value={code}
          onChange={(value) => value !== undefined && setCode(value)}
          theme="vs-dark"
          options={{
            fontSize: 14,
            wordWrap: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          beforeMount={(monaco) => {
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
              {
                noSemanticValidation: true,
                noSyntaxValidation: true,
              }
            );
          }}
        />
      </div>
    </div>
  );
};

export default ResumeEditor;
