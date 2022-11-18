import { SymbolLiteral } from "../../syntax/parser/ast/SymbolLiteral";
import { Type } from "../Type";
import { BoundNodes } from "./BoundNodes";
import { BoundPrimitiveNode } from "./BoundPrimitiveNode";

export class BoundSymbolLiteral extends BoundPrimitiveNode {
  public type = Type.symbol();
  constructor(node: SymbolLiteral) {
    super(BoundNodes.BoundSymbolLiteral, node.token, node.token.location);
  }

  public static new(node: SymbolLiteral) {
    return new BoundSymbolLiteral(node);
  }

  public toString() {
    return `BoundSymbolLiteral ${this.token.value}`;
  }
}
