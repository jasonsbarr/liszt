import { LexResult } from "../lexer/LexResult";
import { TokenNames } from "../lexer/TokenNames";
import { TokenTypes } from "../lexer/TokenTypes";
import { Identifier } from "./ast/Identifier";
import { TypeAlias } from "./ast/TypeAlias";
import { StatementParser } from "./StatementParser";

/**
 * Holds methods for parsing types and classes
 */
export class TypeParser extends StatementParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  private parseTypeAlias() {
    const token = this.reader.next();
    const start = token.location;

    if (this.reader.peek().type !== TokenTypes.Identifier) {
      throw new Error(`Type alias name must be a valid identifier`);
    }

    const name = this.parseExpr(1000) as Identifier;
    this.reader.skip(TokenNames.Equals);
    const type = this.parseTypeAnnotation();
    const end = type.end;

    return TypeAlias.new(name, type, start, end);
  }

  public parseType() {
    const token = this.reader.peek();

    switch (token.name) {
      case TokenNames.Type:
        return this.parseTypeAlias();
      default:
        return this.parseStatement();
    }
  }
}
