import { LexResult } from "../lexer/LexResult";
import { SrcLoc } from "../lexer/SrcLoc";
import { TokenNames } from "../lexer/TokenNames";
import { TokenTypes } from "../lexer/TokenTypes";
import { ASTNode } from "./ast/ASTNode";
import { Identifier } from "./ast/Identifier";
import { LambdaExpression } from "./ast/LambdaExpression";
import { Parameter } from "./ast/Parameter";
import { ParenthesizedExpression } from "./ast/ParenthesizedExpression";
import { TypeAnnotation } from "./ast/TypeAnnotation";
import { ExpressionParser } from "./ExpressionParser";

export class RuleParser extends ExpressionParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  private parseKeyword(): ASTNode {
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
