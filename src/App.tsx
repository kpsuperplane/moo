import React from "react";
import Editor from "./Editor";
import { AppContextProvider } from "./lib/AppContext";
import Parsed from "./Parsed";
import Rendered from "./Rendered";

export default function App() {
  return (
    <AppContextProvider>
      <Editor />
      <div id="output">
        <Rendered />
        <Parsed />
      </div>
    </AppContextProvider>
  );
}
