import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { FloatLiteral } from "../../parser/ast/FloatLiteral";
import { BoundNodes } from "./BoundNodes";

export class BoundFloatLiteral extends FloatLiteral {
  constructor(token: Token, start: SrcLoc) {
    super(token, start);
    this.kind = BoundNodes.BoundFloatLiteral;
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundFloatLiteral(token, start);
  }
}
