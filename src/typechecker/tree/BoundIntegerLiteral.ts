import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { IntegerLiteral } from "../../parser/ast/IntegerLiteral";
import { BoundNodes } from "./BoundNodes";

export class BoundIntegerLiteral extends IntegerLiteral {
  constructor(token: Token, start: SrcLoc) {
    super(token, start);
    this.kind = BoundNodes.BoundIntegerLiteral;
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundIntegerLiteral(token, start);
  }
}
