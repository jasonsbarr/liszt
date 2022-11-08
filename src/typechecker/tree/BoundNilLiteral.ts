import { NilLiteral } from "../../syntax/parser/ast/NilLiteral";
import { Type } from "../Type";
import { BoundNodes } from "./BoundNodes";
import { BoundPrimitiveNode } from "./BoundPrimitiveNode";

export class BoundNilLiteral extends BoundPrimitiveNode {
  public type = Type.nil;
  constructor(node: NilLiteral) {
    super(BoundNodes.BoundNilLiteral, node.token, node.token.location);
  }

  public static new(node: NilLiteral) {
    return new BoundNilLiteral(node);
  }

  public toString() {
    return "BoundNilLiteral";
  }
}
