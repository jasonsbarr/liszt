import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { Type } from "../Type";
import { BoundNodes } from "./BoundNodes";
import { BoundPrimitiveNode } from "./BoundPrimitiveNode";

export class BoundBooleanLiteral extends BoundPrimitiveNode {
  public type = Type.boolean;
  constructor(public token: Token, start: SrcLoc) {
    super(BoundNodes.BoundBooleanLiteral, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundBooleanLiteral(token, start);
  }

  public toString() {
    return `BoundBooleanLiteral ${this.token.value}`;
  }
}
