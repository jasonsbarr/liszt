import { Token } from "../../lexer/Token";
import { SyntaxNodes } from "./SyntaxNodes";
import { PrimitiveNode } from "./PrimitiveNode";
import { SrcLoc } from "../../lexer/SrcLoc";

export class IntegerNode extends PrimitiveNode {
  constructor(value: Token, start: SrcLoc) {
    super(SyntaxNodes.Integer, value, start);
  }

  public static new(value: Token, start: SrcLoc) {
    return new IntegerNode(value, start);
  }
}
