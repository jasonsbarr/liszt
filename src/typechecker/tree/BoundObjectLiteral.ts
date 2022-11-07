import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";
import { BoundObjectProperty } from "./BoundObjectProperty";

export class BoundObjectLiteral extends BoundASTNode {
  constructor(
    public properties: BoundObjectProperty[],
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundObjectLiteral, start, end);
  }

  public static new(
    properties: BoundObjectProperty[],
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new BoundObjectLiteral(properties, start, end);
  }

  public get children() {
    return this.properties;
  }

  public toString() {
    return "BoundObjectLiteral";
  }
}
