import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { Type } from "../Type";
import { BoundNodes } from "./BoundNodes";
import { BoundPrimitiveNode } from "./BoundPrimitiveNode";

export class BoundNilLiteral extends BoundPrimitiveNode {
  public type = Type.nil;
  constructor(token: Token, start: SrcLoc) {
    super(BoundNodes.BoundNilLiteral, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundNilLiteral(token, start);
  }

  public toString() {
    return "BoundNilLiteral";
  }
}
