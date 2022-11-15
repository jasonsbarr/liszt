import { ObjectProperty } from "../../syntax/parser/ast/ObjectProperty";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundObjectProperty extends BoundASTNode {
  constructor(
    public key: BoundASTNode,
    public value: BoundASTNode,
    public type: Type,
    node: ObjectProperty
  ) {
    super(BoundNodes.BoundObjectProperty, node.start, node.end);
  }

  public static new(
    key: BoundASTNode,
    value: BoundASTNode,
    type: Type,
    node: ObjectProperty
  ) {
    return new BoundObjectProperty(key, value, type, node);
  }

  public get children() {
    return [this.key, this.value];
  }
}
