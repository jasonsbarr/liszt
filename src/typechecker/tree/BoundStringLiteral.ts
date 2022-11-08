import { StringLiteral } from "../../syntax/parser/ast/StringLiteral";
import { Type } from "../Type";
import { BoundNodes } from "./BoundNodes";
import { BoundPrimitiveNode } from "./BoundPrimitiveNode";

export class BoundStringLiteral extends BoundPrimitiveNode {
  public type = Type.string;
  constructor(node: StringLiteral) {
    super(BoundNodes.BoundStringLiteral, node.token, node.token.location);
  }

  public static new(node: StringLiteral) {
    return new BoundStringLiteral(node);
  }

  public toString() {
    return `BoundStringLiteral ${this.token.value}`;
  }
}
