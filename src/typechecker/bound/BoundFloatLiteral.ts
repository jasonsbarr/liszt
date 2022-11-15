import { FloatLiteral } from "../../syntax/parser/ast/FloatLiteral";
import { Type } from "../Type";
import { BoundNodes } from "./BoundNodes";
import { BoundPrimitiveNode } from "./BoundPrimitiveNode";

export class BoundFloatLiteral extends BoundPrimitiveNode {
  public type = Type.float;
  constructor(node: FloatLiteral) {
    super(BoundNodes.BoundFloatLiteral, node.token, node.token.location);
  }

  public static new(node: FloatLiteral) {
    return new BoundFloatLiteral(node);
  }
}
