import { IntegerLiteral } from "../../syntax/parser/ast/IntegerLiteral";
import { Type } from "../Type";
import { BoundNodes } from "./BoundNodes";
import { BoundPrimitiveNode } from "./BoundPrimitiveNode";

export class BoundIntegerLiteral extends BoundPrimitiveNode {
  public type = Type.integer;
  constructor(node: IntegerLiteral) {
    super(BoundNodes.BoundIntegerLiteral, node.token, node.token.location);
  }

  public static new(node: IntegerLiteral) {
    return new BoundIntegerLiteral(node);
  }

  public toString() {
    return `BoundIntegerLiteral ${this.token.value}`;
  }
}
