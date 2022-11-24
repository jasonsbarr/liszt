import { Parameter } from "../../syntax/parser/ast/Parameter";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundIdentifier } from "./BoundIdentifier";
import { BoundNodes } from "./BoundNodes";

export class BoundParameter extends BoundASTNode {
  public name: BoundIdentifier;

  constructor(node: Parameter, public type: Type) {
    super(BoundNodes.BoundParameter, node.start, node.end);
    this.name = BoundIdentifier.new(this.type, node.name);
  }

  public static new(node: Parameter, type: Type) {
    return new BoundParameter(node, type);
  }

  public get children() {
    return [this.name];
  }
}
