import { useCallback, useEffect, useRef } from "react";
import Editor, {
  BeforeMount,
  EditorProps,
  OnMount,
} from "@monaco-editor/react";

type MountArgs = Parameters<OnMount>;

export default function (props: EditorProps) {
  // handle resizing of window
  const editor = useRef<MountArgs[0] | null>(null);

  const onMount = useCallback<OnMount>((editorInstance) => {
    editor.current = editorInstance;
  }, []);

  useEffect(() => {
    const onResize = () => {
      editor.current?.layout();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  return (
    <Editor
      {...props}
      path="file.jsx"
      language="javascript"
      theme="vs-light"
      onMount={onMount}
    />
  );
}
