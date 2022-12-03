import { LexResult } from "../lexer/LexResult";
import { TokenNames } from "../lexer/TokenNames";
import { ASTNode } from "./ast/ASTNode";
import { Identifier } from "./ast/Identifier";
import { SpreadOperation } from "./ast/SpreadOperation";
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
    let names: (Identifier | SpreadOperation | TuplePattern)[] = [];
    let rest = false;
    for (let value of expr.values) {
      if (rest) {
        throw new Error(`No left hand values allowed after rest parameter`);
      }

      if (
        value.kind !== SyntaxNodes.Identifier &&
        value.kind !== SyntaxNodes.SpreadOperation &&
        value.kind !== SyntaxNodes.Tuple
      ) {
        throw new Error(
          `Tuple pattern assignment requires valid identifiers, rest parameters, or nested tuples; ${expr} given`
        );
      }

      if (value.kind === SyntaxNodes.Tuple) {
        value = this.parseTuplePattern(value as Tuple);
      }

      if (value.kind === SyntaxNodes.SpreadOperation) {
        rest = true;
      }

      names.push(value as Identifier | SpreadOperation | TuplePattern);
    }

    return TuplePattern.new(names, rest, expr.start, expr.end);
  }
}
