import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundBinaryOperation } from "./BoundBinaryOperation";
import { BoundNodes } from "./BoundNodes";

export class BoundAssignmentExpression extends BoundASTNode {
  constructor(
    public left: BoundASTNode,
    public right: BoundASTNode,
    public operator: string,
    start: SrcLoc,
    end: SrcLoc,
    public type: Type
  ) {
    super(BoundNodes.BoundAssignmentExpression, start, end);
  }

  public static new(
    left: BoundASTNode,
    right: BoundASTNode,
    operator: string,
    start: SrcLoc,
    end: SrcLoc,
    type: Type
  ) {
    return new BoundAssignmentExpression(
      left,
      right,
      operator,
      start,
      end,
      type
    );
  }

  public get children() {
    return [this.left, this.right];
  }
}
