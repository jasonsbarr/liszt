import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { NilLiteral } from "../../parser/ast/NilLiteral";
import { BoundNodes } from "./BoundNodes";

export class BoundNilLiteral extends NilLiteral {
  constructor(token: Token, start: SrcLoc) {
    super(token, start);
    this.kind = BoundNodes.BoundNilLiteral;
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundNilLiteral(token, start);
  }
}
