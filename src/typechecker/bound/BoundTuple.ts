import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundTuple extends BoundASTNode {
  constructor(
    public values: BoundASTNode[],
    public type: Type.Tuple,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundTuple, start, end);
  }

  public static new(
    values: BoundASTNode[],
    type: Type.Tuple,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new BoundTuple(values, type, start, end);
  }

  public get children() {
    return this.values;
  }
}
