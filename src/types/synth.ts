import { Type } from "./Type";
import { SyntaxNodes } from "../parser/ast/SyntaxNodes";
import { ASTNode } from "../parser/ast/ASTNode";
import { IntegerLiteral } from "../parser/ast/IntegerLiteral";

export const synth = (ast: ASTNode) => {
  switch (ast.kind) {
    case SyntaxNodes.IntegerLiteral:
      return synthInteger();
  }
};

const synthInteger = () => Type.integer;
