import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { Type } from "../Type";
import { BoundNodes } from "./BoundNodes";
import { BoundPrimitiveNode } from "./BoundPrimitiveNode";

export class BoundIntegerLiteral extends BoundPrimitiveNode {
  public type = Type.integer;
  constructor(token: Token, start: SrcLoc) {
    super(BoundNodes.BoundIntegerLiteral, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundIntegerLiteral(token, start);
  }

  public toString() {
    return `BoundIntegerLiteral ${this.token.value}`;
  }
}
