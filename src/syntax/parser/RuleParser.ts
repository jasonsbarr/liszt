import { LexResult } from "../lexer/LexResult";
import { SrcLoc } from "../lexer/SrcLoc";
import { TokenNames } from "../lexer/TokenNames";
import { TokenTypes } from "../lexer/TokenTypes";
import { ASTNode } from "./ast/ASTNode";
import { Identifier } from "./ast/Identifier";
import { LambdaExpression } from "./ast/LambdaExpression";
import { Parameter } from "./ast/Parameter";
import { TypeAnnotation } from "./ast/TypeAnnotation";
import { ExpressionParser } from "./ExpressionParser";

export class RuleParser extends ExpressionParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  private parseKeyword(): ASTNode {
    const token = this.reader.peek();

    switch (token.name) {
      case TokenNames.Lambda:
        return this.parseLambda();
      default:
        throw new Error(`Parse rule not found for token name ${token.name}`);
    }
  }

  private parseLambda() {
    let token = this.reader.next();
    const start = token.location;

    this.reader.skip(TokenNames.LParen);
    token = this.reader.peek();
    let parameters: Parameter[] = [];

    while (token.name !== TokenNames.RParen) {
      parameters.push(this.parseParameter());
      token = this.reader.peek();

      if (token.name !== TokenNames.RParen) {
        this.reader.skip(TokenNames.Comma);
        token = this.reader.peek();
      }
    }

    this.reader.skip(TokenNames.RParen);
    token = this.reader.peek();

    let ret: TypeAnnotation | undefined;
    if (token.name === TokenNames.Colon) {
      this.reader.skip(TokenNames.Colon);
      ret = this.parseTypeAnnotation();
    }

    this.reader.skip(TokenNames.FatArrow);

    const body = this.parseExpression();
    const end = body.end;

    return LambdaExpression.new(parameters, body, start, end, ret);
  }

  private parseParameter() {
    let token = this.reader.peek();

    if (token.type !== TokenTypes.Identifier) {
      throw new Error(
        `Parameter name must be valid identifier; ${token.type} given`
      );
    }

    let name = this.parseExpression() as Identifier;
    let annotation: TypeAnnotation | undefined;
    const start = name.start;
    let end: SrcLoc;
    token = this.reader.peek();

    if (token.name === TokenNames.Colon) {
      this.reader.skip(TokenNames.Colon);
      annotation = this.parseTypeAnnotation();
      end = annotation.end;
    } else {
      annotation = undefined;
      end = name.end;
    }

    return Parameter.new(name, start, end, annotation);
  }

  public parseRule() {
    const token = this.reader.peek();

    if (token.type === TokenTypes.Keyword) {
      return this.parseKeyword();
    }

    return this.parseExpression();
  }
}
