import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { ASTNode } from "./ASTNode";
import { BinaryOp } from "./BinaryOp";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeAnnotation } from "./TypeAnnotation";

export class AssignmentExpression extends BinaryOp {
  constructor(
    left: ASTNode,
    right: ASTNode,
    operator: Token,
    start: SrcLoc,
    end: SrcLoc,
    public type?: TypeAnnotation
  ) {
    super(left, right, operator, SyntaxNodes.AssignmentExpression, start, end);
  }

  public static new(
    left: ASTNode,
    right: ASTNode,
    operator: Token,
    start: SrcLoc,
    end: SrcLoc,
    type?: TypeAnnotation
  ) {
    return new AssignmentExpression(left, right, operator, start, end, type);
  }

  public get children() {
    return [this.left, this.right];
  }
}
