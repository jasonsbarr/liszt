import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundReturnStatement extends BoundASTNode {
  constructor(
    public expression: BoundASTNode,
    public type: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundReturnStatement, start, end);
  }

  public static new(
    expression: BoundASTNode,
    type: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new BoundReturnStatement(expression, type, start, end);
  }

  public get children() {
    return [this.expression];
  }
}
