import { LexResult } from "../lexer/LexResult";
import { TokenTypes } from "../lexer/TokenTypes";
import { ExpressionParser } from "./ExpressionParser";

export class RuleParser extends ExpressionParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  private parseKeyword() {
    const token = this.reader.peek();

    switch (token.name) {
      default:
        throw new Error(`Parse rule not found for token name ${token.name}`);
    }
  }

  public parseRule() {
    const token = this.reader.peek();

    if (token.type === TokenTypes.Keyword) {
      return this.parseKeyword();
    }

    return this.parseExpression();
  }
}
