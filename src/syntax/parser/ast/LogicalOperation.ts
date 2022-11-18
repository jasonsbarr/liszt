import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { BinaryOperation } from "./BinaryOperation";
import { SyntaxNodes } from "./SyntaxNodes";

export class LogicalOperation extends BinaryOperation {
  constructor(
    left: ASTNode,
    right: ASTNode,
    operator: string,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(left, right, operator, start, end, SyntaxNodes.LogicalOperation);
  }

  public static new(
    left: ASTNode,
    right: ASTNode,
    operator: string,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new LogicalOperation(left, right, operator, start, end);
  }
}
