import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { Type } from "../Type";
import { BoundNodes } from "./BoundNodes";
import { BoundPrimitiveNode } from "./BoundPrimitiveNode";

export class BoundStringLiteral extends BoundPrimitiveNode {
  public type = Type.string;
  constructor(token: Token, start: SrcLoc) {
    super(BoundNodes.BoundStringLiteral, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundStringLiteral(token, start);
  }

  public toString() {
    return `BoundStringLiteral ${this.token.value}`;
  }
}
