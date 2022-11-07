import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { Type } from "../Type";
import { BoundNodes } from "./BoundNodes";
import { BoundPrimitiveNode } from "./BoundPrimitiveNode";

export class BoundFloatLiteral extends BoundPrimitiveNode {
  public type = Type.float;
  constructor(token: Token, start: SrcLoc) {
    super(BoundNodes.BoundFloatLiteral, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundFloatLiteral(token, start);
  }
}
