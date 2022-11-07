import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { NilLiteral } from "../../syntax/parser/ast/NilLiteral";
import { Type } from "../Type";
import { BoundNodes } from "./BoundNodes";

export class BoundNilLiteral extends NilLiteral {
  public type = Type.nil;
  constructor(token: Token, start: SrcLoc) {
    super(token, start);
    this.kind = BoundNodes.BoundNilLiteral;
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundNilLiteral(token, start);
  }
}
