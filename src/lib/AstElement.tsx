import { CallExpression } from "@babel/types";
import React from "react";

export default function AstElement(props: {
  astNode: CallExpression;
  name: string | symbol;
  children: React.ReactElement;
}) {
  return props.children;
}
