import Editor from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import type { Dispatch, SetStateAction, MutableRefObject } from "react";

type Props = {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  language?: string;
  label?: string;
  editorRef?: MutableRefObject<Monaco.editor.IStandaloneCodeEditor | null>;
};

const ResumeEditor: React.FC<Props> = ({
  code,
  setCode,
  language = "javascript",
  editorRef,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          defaultLanguage={language}
          value={code}
          onMount={(editor) => {
            if (editorRef) {
              editorRef.current = editor;
            }
          }}
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
