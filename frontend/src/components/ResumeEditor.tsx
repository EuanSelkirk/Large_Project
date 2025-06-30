import Editor from "@monaco-editor/react";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
};

const ResumeEditor: React.FC<Props> = ({ code, setCode }) => {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
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
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: true,
        });
      }}
    />
  );
};

export default ResumeEditor;
