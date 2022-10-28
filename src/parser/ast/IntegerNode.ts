import { Token } from "../../lexer/Token";
import { SyntaxNodes } from "./SyntaxNodes";
import { PrimitiveNode } from "./PrimitiveNode";
import { SrcLoc } from "../../lexer/SrcLoc";

export class IntegerNode extends PrimitiveNode {
  constructor(value: Token, start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.Integer, value, start, end);
  }

  public static new(value: Token, start: SrcLoc, end: SrcLoc) {
    return new IntegerNode(value, start, end);
  }
}
