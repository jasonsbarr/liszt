import { LexResult } from "../lexer/LexResult";
import { ASTNode } from "./ast/ASTNode";
import { SyntaxNodes } from "./ast/SyntaxNodes";
import { BaseParser } from "./BaseParser";

export class LHVParser extends BaseParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  public parseLHV(expr: ASTNode) {
    if (expr.kind === SyntaxNodes.Identifier) {
      return expr;
    }

    if (expr.kind === SyntaxNodes.MemberExpression) {
      return expr;
    }

    throw new Error(`Invalid left side expression type ${expr.kind}`);
  }
}
