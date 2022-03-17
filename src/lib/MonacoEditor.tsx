import { useCallback, useEffect, useRef, useState } from "react";
import Editor, {
  BeforeMount,
  EditorProps,
  OnMount,
} from "@monaco-editor/react";

type MountArgs = Parameters<OnMount>;

const colorSchemeQueryList = window.matchMedia("(prefers-color-scheme: dark)");

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

  const [mediaQuery, setMediaQuery] = useState(colorSchemeQueryList);
  useEffect(() => {
    const onChange = (newScheme) => setMediaQuery(newScheme);
    colorSchemeQueryList.addEventListener("change", onChange);
    return () => colorSchemeQueryList.removeEventListener("change", onChange);
  }, []);

  return (
    <Editor
      {...props}
      path="file.jsx"
      language="javascript"
      theme={mediaQuery.matches ? "vs-dark" : "vs-light"}
      onMount={onMount}
    />
  );
}
