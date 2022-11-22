import { Parameter } from "../../syntax/parser/ast/Parameter";
import { fromAnnotation } from "../fromAnnotation";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundIdentifier } from "./BoundIdentifier";
import { BoundNodes } from "./BoundNodes";

export class BoundParameter extends BoundASTNode {
  public name: BoundIdentifier;
  public type: Type;

  constructor(node: Parameter) {
    super(BoundNodes.BoundParameter, node.start, node.end);
    this.type = node.type ? fromAnnotation(node.type) : Type.any();
    this.name = BoundIdentifier.new(this.type, node.name);
  }

  public static new(node: Parameter) {
    return new BoundParameter(node);
  }

  public get children() {
    return [this.name];
  }
}
