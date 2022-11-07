import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundFloatLiteral extends BoundASTNode {
  public type = Type.float;
  constructor(public token: Token, start: SrcLoc) {
    super(BoundNodes.BoundFloatLiteral, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundFloatLiteral(token, start);
  }

  public toString() {
    return `BoundFloatLiteral ${this.token.value}`;
  }
}
