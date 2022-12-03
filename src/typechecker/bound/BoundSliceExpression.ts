import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundSliceExpression extends BoundASTNode {
  constructor(
    public obj: BoundASTNode,
    public index: BoundASTNode,
    public type: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundSliceExpression, start, end);
  }

  public static new(
    obj: BoundASTNode,
    index: BoundASTNode,
    type: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new BoundSliceExpression(obj, index, type, start, end);
  }

  public get children() {
    return [];
  }
}
