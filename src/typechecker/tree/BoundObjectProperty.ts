import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundObjectProperty extends BoundASTNode {
  constructor(
    public key: BoundASTNode,
    public value: BoundASTNode,
    start: SrcLoc,
    end: SrcLoc,
    public type: Type
  ) {
    super(BoundNodes.BoundObjectProperty, start, end);
  }

  new(
    key: BoundASTNode,
    value: BoundASTNode,
    start: SrcLoc,
    end: SrcLoc,
    type: Type
  ) {
    return new BoundObjectProperty(key, value, start, end, type);
  }

  public get children() {
    return [this.key, this.value];
  }

  public toString() {
    return "BoundObjectProperty";
  }
}
