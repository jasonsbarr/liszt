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
    const token = this.reader.next();
    switch (token.type) {
      case TokenTypes.Integer:
        return IntegerLiteral.new(token, token.location);
      case TokenTypes.Float:
        return FloatLiteral.new(token, token.location);
      case TokenTypes.String:
        return StringLiteral.new(token, token.location);
      case TokenTypes.Boolean:
        return BooleanLiteral.new(token, token.location);
      case TokenTypes.Nil:
        return NilLiteral.new(token, token.location);
      case TokenTypes.Identifier:
        return Identifier.new(token, token.location);
      default: {
        switch (token.name) {
          case TokenNames.LParen:
            return this.parseParenthesizedExpression();
          // case TokenNames.LBrace:
          //   return this.parseObjectLiteral();
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

  private parseObjectLiteral() {}

  private parseParenthesizedExpression() {
    const start = this.reader.peek();
    const expr = this.parseExpression();
    const end = this.reader.next();
    return ParenthesizedExpression.new(expr, start.location, end.location);
  }
}
