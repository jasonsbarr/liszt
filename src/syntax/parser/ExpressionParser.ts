import { LexResult } from "../lexer/LexResult";
import { TokenNames } from "../lexer/TokenNames";
import { TokenTypes } from "../lexer/TokenTypes";
import { ASTNode } from "./ast/ASTNode";
import { BooleanLiteral } from "./ast/BooleanLiteral";
import { FloatLiteral } from "./ast/FloatLiteral";
import { IntegerLiteral } from "./ast/IntegerLiteral";
import { NilLiteral } from "./ast/NilLiteral";
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
