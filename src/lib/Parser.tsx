import { BabelFileResult } from "@babel/core";
import {
  ArgumentPlaceholder,
  CallExpression,
  Expression,
  Identifier,
  JSXNamespacedName,
  NumericLiteral,
  PatternLike,
  SpreadElement,
  Statement,
  StringLiteral,
  V8IntrinsicIdentifier,
} from "@babel/types";

import components from "../components";

import React from "react";
import AstElement from "./AstElement";

function stringify(value: any) {
  return JSON.stringify(value);
}

function matchMemberExpression(
  expression: Expression | V8IntrinsicIdentifier,
  object: string,
  property?: string
) {
  if (
    expression.type === "MemberExpression" &&
    expression.object.type === "Identifier" &&
    expression.object.name === object &&
    expression.property.type === "Identifier"
  ) {
    if (
      typeof property === "undefined" ||
      expression.property.name === property
    ) {
      return { object, property: expression.property.name };
    }
  }
  return null;
}

function parseLiteral(
  ident:
    | Expression
    | Identifier
    | StringLiteral
    | NumericLiteral
    | SpreadElement
    | JSXNamespacedName
    | ArgumentPlaceholder
    | PatternLike,
  except: boolean = false
): string | number | object {
  switch (ident.type) {
    case "Identifier":
      return ident.name;
    case "StringLiteral":
    case "NumericLiteral":
      return ident.value;
    case "NullLiteral":
      return null;
    case "ObjectExpression":
      return parseExpression(ident);
    default:
      if (except) {
        throw new Error(
          `Unable to parse value of type ${ident.type}: ${stringify(ident)}`
        );
      } else {
        return undefined;
      }
  }
}

function parseArgument(
  argument: Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder
) {
  const literal = parseLiteral(argument);
  if (literal !== undefined) {
    return literal;
  }
  switch (argument.type) {
    case "MemberExpression":
      const reactExpr = matchMemberExpression(argument, "React");
      if (reactExpr !== null) {
        return React[reactExpr.property];
      }
    case "CallExpression":
    case "ObjectExpression":
      return parseExpression(argument);
    default:
      throw new Error(
        `Unexpected argument type ${argument.type}: ${stringify(argument)}`
      );
  }
}
function parseCallExpression(expression: CallExpression) {
  const args = expression.arguments.map(parseArgument);
  if (
    matchMemberExpression(expression.callee, "React", "createElement") !== null
  ) {
    const name = args[0];
    if (args[0] in components) {
      args[0] = components[args[0]];
    }
    return (
      <AstElement astNode={expression} name={name}>
        {React.createElement.apply(this, args)}
      </AstElement>
    );
  }
  throw new Error(`Unable to parse call expression: ${stringify(expression)}`);
}

function parseExpression(expression: Expression) {
  switch (expression.type) {
    case "CallExpression":
      return parseCallExpression(expression);
    case "ObjectExpression":
      const result = {};
      for (const property of expression.properties) {
        switch (property.type) {
          case "ObjectProperty":
            const key = parseLiteral(property.key, true);
            if (typeof key !== "object") {
              result[key] = parseLiteral(property.value, true);
              break;
            }
          default:
            throw new Error(
              `Unable to parse object property of type ${
                property.type
              }: ${stringify(property)}`
            );
        }
      }
      return result;
    default:
      throw new Error(
        `Unexpected expression type ${expression.type}: ${stringify(
          expression
        )}`
      );
  }
}

function parseStatement(statement: Statement) {
  switch (statement.type) {
    case "ExpressionStatement":
      return parseExpression(statement.expression);
    default:
      throw new Error(
        `Unexpected statement type ${statement.type}: ${stringify(statement)}`
      );
  }
}

export default function parseAst(file: BabelFileResult) {
  return parseStatement(file.ast.program.body[0]);
}
