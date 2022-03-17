import React from "react";

import { useAppContext } from "./lib/AppContext";
import MonacoEditor from "./lib/MonacoEditor";

export default function Editor() {
  const { code, setCode } = useAppContext();

  return (
    <div id="editor" className="section">
      <h2 className="heading">Code</h2>
      <div className="content">
        <MonacoEditor
          options={{
            tabSize: 2,
          }}
          value={code}
          onChange={setCode}
        />
      </div>
    </div>
  );
}
