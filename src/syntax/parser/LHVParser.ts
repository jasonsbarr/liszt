import { LexResult } from "../lexer/LexResult";
import { ASTNode } from "./ast/ASTNode";
import { Identifier } from "./ast/Identifier";
import { SyntaxNodes } from "./ast/SyntaxNodes";
import { Tuple } from "./ast/Tuple";
import { TuplePattern } from "./ast/TuplePattern";
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

    if (expr.kind === SyntaxNodes.Tuple) {
      return this.parseTuplePattern(expr as Tuple);
    }

    throw new Error(`Invalid left side expression type ${expr.kind}`);
  }

  private parseTuplePattern(expr: Tuple) {
    let names: Identifier[] = [];
    for (let value of expr.values) {
      if (
        value.kind !== SyntaxNodes.Identifier &&
        value.kind !== SyntaxNodes.SpreadOperation
      ) {
        throw new Error(
          `Tuple pattern assignment expects valid identifiers; ${expr} given`
        );
      }
      names.push(value as Identifier);
    }

    return TuplePattern.new(names, expr.start, expr.end);
  }
}
