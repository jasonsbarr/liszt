import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { FloatLiteral } from "../../syntax/parser/ast/FloatLiteral";
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
