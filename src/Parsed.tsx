import React, { useMemo } from "react";
import { useAppContext } from "./lib/AppContext";

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Element({ item }) {
  const { element, depth } = item;
  const elementName = element.props.name;
  const name = useMemo(() => {
    switch (typeof elementName) {
      case "symbol":
        return elementName.description
          .split(".")
          .map((s) => capitalize(s))
          .join(".");
      default:
        return elementName;
    }
  }, [elementName]);
  const props =
    typeof element.props.children === "object" &&
    element.props.children.props != null
      ? element.props.children.props
      : {};
  return (
    <div className="element">
      <span style={{ paddingLeft: depth * 10 }}>
        {"<"}
        <span className="tag">{name}</span>
        {Object.keys(props).map((key) =>
          key === "children" ? null : (
            <>
              {" "}
              <span className="argName">{key}</span>
              <span className="argEq">=</span>
              <span className="argValue">{props[key]}</span>
            </>
          )
        )}
        {" />"}
      </span>
    </div>
  );
}

function getElements(parent: any, element: any, depth: number) {
  if (
    element == null ||
    typeof element !== "object" ||
    element.type.name === "PrettyError"
  ) {
    return null;
  }
  const { start, end } = element.props.astNode.loc;
  const key = `${start.line}:${start.column}:${end.line}:${end.column}`;
  const children = element.props.children?.props?.children;
  const item = { parent, element, depth, key };
  return [
    item,
    ...(Array.isArray(children) ? children : [children]).flatMap((element) =>
      getElements(item, element, depth + 1)
    ),
  ].filter(Boolean);
}

function List({ items }) {
  return (
    <div className="content">
      {items?.map(({ key, ...value }) => (
        <Element key={key} item={value} />
      ))}
    </div>
  );
}

export default function Parsed() {
  const { rendered } = useAppContext();
  const items = useMemo(() => getElements(null, rendered, 0), [rendered]);
  return (
    <div id="parsed" className="section">
      <h2 className="heading">Parsed</h2>
      <List items={items} />
    </div>
  );
}
