import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDebouncedCallback } from "use-debounce/lib";

import * as Babel from "@babel/standalone";
import PresetReact from "@babel/preset-react";
import { BabelFileResult } from "@babel/core";

import DEFAULT_CODE from "./defaultCode";
import parseAst from "./Parser";
import PrettyError from "./PrettyError";

Babel.registerPreset("@babel/preset-react", PresetReact);

export const AppContext = createContext<{
  babel: null | BabelFileResult;
  rendered: React.ReactNode;
  code: string;
  setCode: (code: string) => void;
}>({
  babel: null,
  rendered: null,
  code: "",
  setCode: () => {},
});

export function AppContextProvider(props: { children: React.ReactNode }) {
  const [babel, setBabel] = useState<BabelFileResult | null>(null);
  const [rendered, setRendered] = useState<React.ReactNode | null>(null);

  const [code, _setCode] = useState(
    localStorage.getItem("code")?.trim() || DEFAULT_CODE
  );

  const parse = useDebouncedCallback(() => {
    localStorage.setItem("code", code);
    try {
      const babel = Babel.transform(code, {
        ast: true,
        highlightCode: true,
        presets: [["@babel/preset-react"]],
      }) as unknown as BabelFileResult;
      setBabel(babel);
      setRendered(parseAst(babel));
    } catch (e) {
      console.error(e);
      setRendered(<PrettyError error={e} />);
    }
  }, 1000);
  const setCode = useCallback((code: string) => {
    _setCode(code);
    parse();
  }, []);

  const value = { babel, code, setCode, rendered };

  useEffect(() => parse(), []);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
