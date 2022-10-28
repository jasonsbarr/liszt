import { LexResult } from "../lexer/LexResult";
import { TokenNames } from "../lexer/TokenNames";
import { ASTNode } from "./ast/ASTNode";
import { IntegerNode } from "./ast/IntegerNode";
import { LHVParser } from "./LHVParser";

const nudAttributes = {
  Integer: { prec: 0, assoc: "none" },
};

const ledAttributes = {};

export class ExpressionParser extends LHVParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  private parseAtom(): ASTNode {
    const token = this.reader.next();
    switch (token.name) {
      case TokenNames.Integer:
        return IntegerNode.new(token, token.location);
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
