import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundBinaryOp } from "./BoundBinaryOp";
import { BoundNodes } from "./BoundNodes";

export class BoundAssignmentExpression extends BoundBinaryOp {
  constructor(
    left: BoundASTNode,
    right: BoundASTNode,
    operator: Token,
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
      BoundNodes.BoundAssignmentExpression
    );
  }

  public static new(
    left: BoundASTNode,
    right: BoundASTNode,
    operator: Token,
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
}
