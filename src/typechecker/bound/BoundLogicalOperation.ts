import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundBinaryOp as BoundBinaryOperation } from "./BoundBinaryOperation";
import { BoundNodes } from "./BoundNodes";

export class BoundLogicalOperation extends BoundBinaryOperation {
  constructor(
    left: BoundASTNode,
    right: BoundASTNode,
    operator: string,
    start: SrcLoc,
    end: SrcLoc,
    type: Type
  ) {
    super(
      left,
      right,
      operator,
      start,
      end,
      type,
      BoundNodes.BoundLogicalOperation
    );
  }

  public static new(
    left: BoundASTNode,
    right: BoundASTNode,
    operator: string,
    start: SrcLoc,
    end: SrcLoc,
    type: Type
  ) {
    return new BoundLogicalOperation(left, right, operator, start, end, type);
  }
}
