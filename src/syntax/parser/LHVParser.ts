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

  public parseLHV(expr: ASTNode): DestructuringLHV {
    if (expr.kind === SyntaxNodes.Identifier) {
      return expr;
    }

    if (expr.kind === SyntaxNodes.MemberExpression) {
      return expr;
    }

    if (expr.kind === SyntaxNodes.SliceExpression) {
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
          SyntaxNodes.Identifier,
          SyntaxNodes.SpreadOperation,
          SyntaxNodes.Tuple,
        ].includes(value.kind)
      ) {
        throw new Error(
          `Tuple pattern assignment requires valid identifiers, rest parameters, or nested tuples; ${expr} given`
        );
      }

      if (value.kind === SyntaxNodes.SpreadOperation) {
        rest = true;
      }

      let name = this.parseLHV(value);

      names.push(name);
    }

    return TuplePattern.new(names, rest, expr.start, expr.end);
  }
}
