import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { BooleanLiteral } from "../syntax/parser/ast/BooleanLiteral";
import { FloatLiteral } from "../syntax/parser/ast/FloatLiteral";
import { Identifier } from "../syntax/parser/ast/Identifier";
import { IntegerLiteral } from "../syntax/parser/ast/IntegerLiteral";
import { ObjectLiteral } from "../syntax/parser/ast/ObjectLiteral";
import { ObjectProperty } from "../syntax/parser/ast/ObjectProperty";
import { StringLiteral } from "../syntax/parser/ast/StringLiteral";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { synth } from "./synth";
import { BoundASTNode } from "./tree/BoundASTNode";
import { BoundBooleanLiteral } from "./tree/BoundBooleanLiteral";
import { BoundFloatLiteral } from "./tree/BoundFloatLiteral";
import { BoundIdentifier } from "./tree/BoundIdentifier";
import { BoundIntegerLiteral } from "./tree/BoundIntegerLiteral";
import { BoundObjectLiteral } from "./tree/BoundObjectLiteral";
import { BoundObjectProperty } from "./tree/BoundObjectProperty";
import { BoundStringLiteral } from "./tree/BoundStringLiteral";
import { Type } from "./Type";

export const bind = (node: ASTNode, ty?: Type): BoundASTNode => {
  let key, value, synthType;

  switch (node.kind) {
    case SyntaxNodes.IntegerLiteral:
      return BoundIntegerLiteral.new(node as IntegerLiteral);
    case SyntaxNodes.FloatLiteral:
      return BoundFloatLiteral.new(node as FloatLiteral);
    case SyntaxNodes.BooleanLiteral:
      return BoundBooleanLiteral.new(node as BooleanLiteral);
    case SyntaxNodes.StringLiteral:
      return BoundStringLiteral.new(node as StringLiteral);
    case SyntaxNodes.Identifier:
      if (!ty) {
        throw new Error(
          `No type given for identifier ${(node as Identifier).name}`
        );
      }
      return BoundIdentifier.new(ty, node as Identifier);
    case SyntaxNodes.ObjectProperty:
      synthType = synth((node as ObjectProperty).value);
      key = bind((node as ObjectProperty).key, synthType);
      value = bind((node as ObjectProperty).value);
      return BoundObjectProperty.new(
        key,
        value,
        synthType,
        node as ObjectProperty
      );
    case SyntaxNodes.ObjectLiteral:
      const properties: BoundObjectProperty[] = (
        node as ObjectLiteral
      ).properties.map((prop) => bind(prop) as BoundObjectProperty);
      if (!ty) {
        throw new Error(`No type given for binding object literal`);
      }
      return BoundObjectLiteral.new(ty, properties, node as ObjectLiteral);
    default:
      throw new Error(`Cannot bind node of kind ${node.kind}`);
  }
};
