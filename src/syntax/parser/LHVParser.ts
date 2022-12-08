import { LexResult } from "../lexer/LexResult";
import { ASTNode } from "./ast/ASTNode";
import { DestructuringLHV } from "./ast/DestructuringLHV";
import { Identifier } from "./ast/Identifier";
import { ObjectPattern } from "./ast/ObjectPattern";
import { SetLiteral } from "./ast/SetLiteral";
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

    if (expr.kind === SyntaxNodes.SliceExpression) {
      return expr;
    }

    if (expr.kind === SyntaxNodes.Tuple) {
      return this.parseTuplePattern(expr as Tuple);
    }

    if (expr.kind === SyntaxNodes.SetLiteral) {
      return this.parseObjectPattern(expr as SetLiteral);
    }

    if (expr.kind === SyntaxNodes.SpreadOperation) {
      return this.parseSpreadOperation(expr as SpreadOperation);
    }

    throw new Error(`Invalid left side expression type ${expr.kind}`);
  }

  private parseObjectPattern(expr: SetLiteral) {
    let names: DestructuringLHV[] = [];
    let rest = false;
    for (let member of expr.members) {
      if (rest) {
        throw new Error("No left hand values allowed after rest parameter");
      }

      if (
        ![
          SyntaxNodes.Identifier,
          SyntaxNodes.SpreadOperation,
          SyntaxNodes.Tuple,
          SyntaxNodes.SetLiteral,
        ].includes(member.kind)
      ) {
        throw new Error(
          `Object pattern assignment requires valid assignment parameter; ${member.kind} given`
        );
      }

      if (member.kind === SyntaxNodes.SpreadOperation) {
        rest = true;
      }

      let name = this.parseLHV(member) as DestructuringLHV;

      names.push(name);
    }

    return ObjectPattern.new(names, rest, expr.start, expr.end);
  }

  private parseSpreadOperation(expr: SpreadOperation) {
    if (expr.expression.kind !== SyntaxNodes.Identifier) {
      throw new Error(
        `Rest parameter in left hand assignment value must be a valid identifier; ${expr.kind} given`
      );
    }

    return expr;
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
          SyntaxNodes.SetLiteral,
        ].includes(value.kind)
      ) {
        throw new Error(
          `Tuple pattern assignment requires valid assignment parameter; ${expr} given`
        );
      }

      if (value.kind === SyntaxNodes.SpreadOperation) {
        rest = true;
      }

      let name = this.parseLHV(value) as DestructuringLHV;

      names.push(name);
    }

    return TuplePattern.new(names, rest, expr.start, expr.end);
  }
}
