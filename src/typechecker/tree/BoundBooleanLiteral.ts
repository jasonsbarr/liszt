import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { BooleanLiteral } from "../../parser/ast/BooleanLiteral";
import { BoundNodes } from "./BoundNodes";

export class BoundBooleanLiteral extends BooleanLiteral {
  constructor(token: Token, start: SrcLoc) {
    super(token, start);
    this.kind = BoundNodes.BoundBooleanLiteral;
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundBooleanLiteral(token, start);
  }
}
