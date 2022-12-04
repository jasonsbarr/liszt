import { LexResult } from "../lexer/LexResult";
import { ASTNode } from "./ast/ASTNode";
import { DestructuringLHV } from "./ast/DestructuringLHV";
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
    let names: DestructuringLHV[] = [];
    let rest = false;
    for (let value of expr.values) {
      if (rest) {
        throw new Error(`No left hand values allowed after rest parameter`);
      }

      if (
        ![
          SyntaxNodes.Identifier as string,
          SyntaxNodes.SpreadOperation as string,
          SyntaxNodes.Tuple as string,
        ].includes(value.kind)
      ) {
        throw new Error(
          `Tuple pattern assignment requires valid identifiers, rest parameters, or nested tuples; ${expr} given`
        );
      }

      if (value.kind === SyntaxNodes.SpreadOperation) {
        rest = true;
      }

      if (
        value.kind !== SyntaxNodes.Identifier &&
        value.kind !== SyntaxNodes.SpreadOperation
      ) {
        value = this.parseLHV(value);
      }

      names.push(value as DestructuringLHV);
    }

    return TuplePattern.new(names, rest, expr.start, expr.end);
  }
}
