import { LexResult } from "../lexer/LexResult";
import { SrcLoc } from "../lexer/SrcLoc";
import { TokenNames } from "../lexer/TokenNames";
import { TokenTypes } from "../lexer/TokenTypes";
import { ASTNode } from "./ast/ASTNode";
import { BooleanLiteral } from "./ast/BooleanLiteral";
import { FloatLiteral } from "./ast/FloatLiteral";
import { Identifier } from "./ast/Identifier";
import { IntegerLiteral } from "./ast/IntegerLiteral";
import { NilLiteral } from "./ast/NilLiteral";
import { ObjectLiteral } from "./ast/ObjectLiteral";
import { ObjectProperty } from "./ast/ObjectProperty";
import { ParenthesizedExpression } from "./ast/ParenthesizedExpression";
import { StringLiteral } from "./ast/StringLiteral";
import { LHVParser } from "./LHVParser";

const nudAttributes = {
  [TokenNames.Integer]: { prec: 0, assoc: "none" },
  [TokenNames.Float]: { prec: 0, assoc: "none" },
  [TokenNames.NaN]: { prec: 0, assoc: "none" },
  [TokenNames.Infinity]: { prec: 0, assoc: "none" },
  [TokenNames.String]: { prec: 0, assoc: "none" },
  [TokenNames.True]: { prec: 0, assoc: "none" },
  [TokenNames.False]: { prec: 0, assoc: "none" },
  [TokenNames.Nil]: { prec: 0, assoc: "none" },
};

const ledAttributes = {};

export abstract class ExpressionParser extends LHVParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  private parseAtom(): ASTNode {
    const token = this.reader.peek();
    switch (token.type) {
      case TokenTypes.Integer:
        this.reader.skip(TokenNames.Integer);
        return IntegerLiteral.new(token, token.location);
      case TokenTypes.Float:
        this.reader.skip(TokenNames.Float);
        return FloatLiteral.new(token, token.location);
      case TokenTypes.String:
        this.reader.skip(TokenNames.String);
        return StringLiteral.new(token, token.location);
      case TokenTypes.Boolean:
        this.reader.skip(
          token.name === TokenNames.True ? TokenNames.True : TokenNames.False
        );
        return BooleanLiteral.new(token, token.location);
      case TokenTypes.Nil:
        this.reader.skip(TokenNames.Nil);
        return NilLiteral.new(token, token.location);
      case TokenTypes.Identifier:
        this.reader.skip(TokenNames.Identifier);
        return Identifier.new(token, token.location);
      default: {
        switch (token.name) {
          case TokenNames.LParen:
            return this.parseParenthesizedExpression();
          case TokenNames.LBrace:
            return this.parseObjectLiteral();
          default:
            throw new Error(
              `Unrecognized token (type: ${token.type}, name: ${token.name})`
            );
        }
      }
    }
  }

  private parseExpr() {
    return this.parseAtom();
  }

  protected parseExpression() {
    return this.parseExpr();
  }

  private parseObjectLiteral() {
    const start = this.reader.next();
    let properties: ObjectProperty[] = [];

    while (this.reader.peek().name !== TokenNames.RBrace) {
      const st = this.reader.peek().location;
      const key = this.parseExpr();
      this.reader.skip(TokenNames.Colon);
      const value = this.parseExpr();
      const en = this.reader.peek();
      properties.push(ObjectProperty.new(key, value, st, en.location));

      // note that this will allow trailing commas on object literals
      if (en.name !== TokenNames.LBrace) {
        this.reader.skip(TokenNames.Comma);
      }
    }
    const end = this.reader.next();

    return ObjectLiteral.new(properties, start.location, end.location);
  }

  private parseParenthesizedExpression() {
    const start = this.reader.next();
    const expr = this.parseExpression();
    const end = this.reader.next();
    return ParenthesizedExpression.new(expr, start.location, end.location);
  }
}
