import { Token } from "../../lexer/Token";
import { SyntaxNodes } from "./SyntaxNodes";
import { PrimitiveNode } from "./PrimitiveNode";
import { SrcLoc } from "../../lexer/SrcLoc";

export class IntegerLiteral extends PrimitiveNode {
  constructor(token: Token, start: SrcLoc) {
    super(SyntaxNodes.IntegerLiteral, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new IntegerLiteral(token, start);
  }
}
