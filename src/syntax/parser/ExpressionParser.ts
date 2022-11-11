import { LexResult } from "../lexer/LexResult";
import { TokenNames } from "../lexer/TokenNames";
import { TokenTypes } from "../lexer/TokenTypes";
import { AsExpression } from "./ast/AsExpression";
import { ASTNode } from "./ast/ASTNode";
import { BooleanLiteral } from "./ast/BooleanLiteral";
import { CallExpression } from "./ast/CallExpression";
import { FloatLiteral } from "./ast/FloatLiteral";
import { Identifier } from "./ast/Identifier";
import { IntegerLiteral } from "./ast/IntegerLiteral";
import { MemberExpression } from "./ast/MemberExpression";
import { NilLiteral } from "./ast/NilLiteral";
import { ObjectLiteral } from "./ast/ObjectLiteral";
import { ObjectProperty } from "./ast/ObjectProperty";
import { ParenthesizedExpression } from "./ast/ParenthesizedExpression";
import { StringLiteral } from "./ast/StringLiteral";
import { SyntaxNodes } from "./ast/SyntaxNodes";
import { TypeAnnotationParser } from "./TypeAnnotationParser";

const nudAttributes = {
  [TokenNames.Integer]: { prec: 0, assoc: "none" },
  [TokenNames.Float]: { prec: 0, assoc: "none" },
  [TokenNames.NaN]: { prec: 0, assoc: "none" },
  [TokenNames.Infinity]: { prec: 0, assoc: "none" },
  [TokenNames.String]: { prec: 0, assoc: "none" },
  [TokenNames.True]: { prec: 0, assoc: "none" },
  [TokenNames.False]: { prec: 0, assoc: "none" },
  [TokenNames.Nil]: { prec: 0, assoc: "none" },
  [TokenNames.Identifier]: { prec: 0, assoc: "none" },
};

type nud = keyof typeof nudAttributes;

const ledAttributes = {
  [TokenNames.Dot]: { prec: 90, assoc: "left" },
  [TokenNames.LParen]: { prec: 90, assoc: "left" },
  [TokenNames.As]: { prec: 5, assoc: "left" },
};

type led = keyof typeof ledAttributes;

export class ExpressionParser extends TypeAnnotationParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  private getLedPrecedence() {
    const token = this.reader.peek();
    return ledAttributes[token.name as led]?.prec ?? -1;
  }

  private parseAsExpression(left: ASTNode) {
    const start = left.start;
    this.reader.skip(TokenNames.As);
    const annotation = this.parseTypeAnnotation();
    const end = annotation.end;

    return AsExpression.new(left, annotation, start, end);
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

  private parseCallExpression(left: ASTNode) {
    if (left.kind === SyntaxNodes.LambdaExpression) {
      throw new Error(
        "Lambda expression must be wrapped in parentheses before immediately invoking it"
      );
    }

    const start = left.start;
    this.reader.skip(TokenNames.LParen);
    let token = this.reader.peek();
    let args: ASTNode[] = [];

    while (token.name !== TokenNames.RParen) {
      args.push(this.parseExpr());
      token = this.reader.peek();

      if (token.name !== TokenNames.RParen) {
        this.reader.skip(TokenNames.Comma);
        token = this.reader.peek();
      }
    }

    const end = token.location;

    return CallExpression.new(left, args, start, end);
  }

  private parseExpr(rbp: number = 0) {
    let left = this.parseAtom();
    let prec = this.getLedPrecedence();

    while (rbp < prec) {
      left = this.parseLed(left);
      prec = this.getLedPrecedence();
    }

    return left;
  }

  public parseExpression(rbp: number = 0) {
    return this.parseExpr(rbp);
  }

  private parseLed(left: ASTNode) {
    let token = this.reader.peek();

    switch (token.name) {
      case TokenNames.Dot:
        return this.parseMemberExpression(left);
      case TokenNames.LParen:
        return this.parseCallExpression(left);
      case TokenNames.As:
        return this.parseAsExpression(left);
      default:
        throw new Error(`Token ${token.name} does not have a left denotation`);
    }
  }

  private parseMemberExpression(left: ASTNode) {
    const prec = this.getLedPrecedence();
    this.reader.skip(TokenNames.Dot);
    const prop = this.parseExpression(prec);

    return MemberExpression.new(left, prop as Identifier, left.start, prop.end);
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
      properties.push(
        ObjectProperty.new(key as Identifier, value, st, en.location)
      );

      // note that this will allow trailing commas on object literals
      if (this.reader.peek().name !== TokenNames.RBrace) {
        this.reader.skip(TokenNames.Comma);
      }
    }
    const end = this.reader.next();

    return ObjectLiteral.new(properties, start.location, end.location);
  }
}
