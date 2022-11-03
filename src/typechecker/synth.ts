import { Type } from "./Type";
import { SyntaxNodes } from "../parser/ast/SyntaxNodes";
import { ASTNode } from "../parser/ast/ASTNode";

export const synth = (ast: ASTNode) => {
  switch (ast.kind) {
    case SyntaxNodes.IntegerLiteral:
      return synthInteger();
    case SyntaxNodes.FloatLiteral:
      return synthFloat();
    case SyntaxNodes.StringLiteral:
      return synthString();
    case SyntaxNodes.BooleanLiteral:
      return synthBoolean();
    case SyntaxNodes.NilLiteral:
      return synthNil();
    default:
      throw new Error(`Unknown type for expression type ${ast.kind}`);
  }
};

const synthInteger = () => Type.integer;
const synthFloat = () => Type.float;
const synthString = () => Type.string;
const synthBoolean = () => Type.boolean;
const synthNil = () => Type.nil;
