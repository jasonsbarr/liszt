import { ObjectLiteral } from "../../syntax/parser/ast/ObjectLiteral";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";
import { BoundObjectProperty } from "./BoundObjectProperty";

export class BoundObjectLiteral extends BoundASTNode {
  constructor(
    public type: Type,
    public properties: BoundObjectProperty[],
    node: ObjectLiteral
  ) {
    super(BoundNodes.BoundObjectLiteral, node.start, node.end);
  }

  public static new(
    type: Type,
    properties: BoundObjectProperty[],
    node: ObjectLiteral
  ) {
    return new BoundObjectLiteral(type, properties, node);
  }

  public get children() {
    return this.properties;
  }

  public toString() {
    return "BoundObjectLiteral";
  }
}
