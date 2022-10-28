import { Token } from "../../lexer/Token";
import { SyntaxNodes } from "./SyntaxNodes";
import { PrimitiveNode } from "./PrimitiveNode";
import { SrcLoc } from "../../lexer/SrcLoc";

export class IntegerNode extends PrimitiveNode {
  constructor(token: Token, start: SrcLoc) {
    super(SyntaxNodes.Integer, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new IntegerNode(token, start);
  }
}
