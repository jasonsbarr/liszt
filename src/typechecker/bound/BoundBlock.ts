import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundBlock extends BoundASTNode {
  constructor(
    public expressions: BoundASTNode[],
    public type: Type,
    start: SrcLoc,
    end: SrcLoc,
    public statement = false
  ) {
    super(BoundNodes.BoundBlock, start, end);
  }

  public static new(
    expressions: BoundASTNode[],
    type: Type,
    start: SrcLoc,
    end: SrcLoc,
    statement = false
  ) {
    return new BoundBlock(expressions, type, start, end, statement);
  }

  public get children() {
    return this.expressions;
  }
}
