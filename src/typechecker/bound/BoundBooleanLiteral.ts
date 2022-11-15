import { BooleanLiteral } from "../../syntax/parser/ast/BooleanLiteral";
import { Type } from "../Type";
import { BoundNodes } from "./BoundNodes";
import { BoundPrimitiveNode } from "./BoundPrimitiveNode";

export class BoundBooleanLiteral extends BoundPrimitiveNode {
  public type = Type.boolean;
  constructor(node: BooleanLiteral) {
    super(BoundNodes.BoundBooleanLiteral, node.token, node.token.location);
  }

  public static new(node: BooleanLiteral) {
    return new BoundBooleanLiteral(node);
  }

  public toString() {
    return `BoundBooleanLiteral ${this.token.value}`;
  }
}
