import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { StringLiteral } from "../../parser/ast/StringLiteral";
import { BoundNodes } from "./BoundNodes";

export class BoundStringLiteral extends StringLiteral {
  constructor(token: Token, start: SrcLoc) {
    super(token, start);
    this.kind = BoundNodes.BoundStringLiteral;
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundStringLiteral(token, start);
  }
}
