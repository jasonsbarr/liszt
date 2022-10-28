import { Token } from "../../lexer/Token";
import { SyntaxNodes } from "./SyntaxNodes";
import { PrimitiveNode } from "./PrimitiveNode";

export class IntegerNode extends PrimitiveNode {
  constructor(value: Token) {
    super(SyntaxNodes.Integer, value);
  }

  public static new(value: Token) {
    return new IntegerNode(value);
  }
}
