import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { ASTNode } from "./ASTNode";
import { BinaryOp } from "./BinaryOp";
import { SyntaxNodes } from "./SyntaxNodes";

export class AssignmentExpression extends BinaryOp {
  constructor(
    left: ASTNode,
    right: ASTNode,
    operator: Token,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(left, right, operator, SyntaxNodes.AssignmentExpression, start, end);
  }

  public static new(
    left: ASTNode,
    right: ASTNode,
    operator: Token,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new AssignmentExpression(left, right, operator, start, end);
  }

  public get children() {
    return [this.left, this.right];
  }
}
