import { Token } from "../../lexer/Token";
import { PrimitiveNode } from "./PrimitiveNode";

export class IntegerNode extends PrimitiveNode {
  constructor(value: Token) {
    super("IntegerNode", value);
  }

  public static new(value: Token) {
    return new IntegerNode(value);
  }
}
