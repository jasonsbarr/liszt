import { LexResult } from "../lexer/LexResult";
import { TokenTypes } from "../lexer/TokenTypes";
import { ASTNode } from "./ast/ASTNode";
import { BooleanLiteral } from "./ast/BooleanLiteral";
import { IntegerLiteral } from "./ast/IntegerLiteral";
import { NilLiteral } from "./ast/NilLiteral";
import { StringLiteral } from "./ast/StringLiteral";
import { LHVParser } from "./LHVParser";

const nudAttributes = {
  Integer: { prec: 0, assoc: "none" },
  String: { prec: 0, assoc: "none" },
  Boolean: { prec: 0, assoc: "none" },
  Nil: { prec: 0, assoc: "none" },
};

const ledAttributes = {};

export abstract class ExpressionParser extends LHVParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  private parseAtom(): ASTNode {
    const token = this.reader.next();
    switch (token.type) {
      case TokenTypes.Integer:
        return IntegerLiteral.new(token, token.location);
      case TokenTypes.String:
        return StringLiteral.new(token, token.location);
      case TokenTypes.Boolean:
        return BooleanLiteral.new(token, token.location);
      case TokenTypes.Nil:
        return NilLiteral.new(token, token.location);
      default:
        throw new Error(`Unknown token kind ${token.name}`);
    }
  }

  private parseExpr() {
    return this.parseAtom();
  }

  protected parseExpression() {
    return this.parseExpr();
  }
}
