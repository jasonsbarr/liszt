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
    let names: Identifier[] = [];
    let rest = false;
    for (let value of expr.values) {
      if (rest) {
        throw new Error(`No left hand values allowed after rest parameter`);
      }

      if (
        value.kind !== SyntaxNodes.Identifier &&
        value.kind !== SyntaxNodes.SpreadOperation
      ) {
        throw new Error(
          `Tuple pattern assignment expects valid identifiers; ${expr} given`
        );
      }

      if (value.kind === SyntaxNodes.SpreadOperation) {
        if (
          (value as SpreadOperation).expression.kind !== SyntaxNodes.Identifier
        ) {
          throw new Error(
            `Rest parameter in tuple pattern assignment must be a valid identifier; ${
              (value as SpreadOperation).kind
            } given.`
          );
        }
        rest = true;
      }

      value =
        value.kind === SyntaxNodes.SpreadOperation
          ? (value as SpreadOperation)
          : (value as Identifier);
    }

    return TuplePattern.new(names, expr.start, expr.end);
  }
}
