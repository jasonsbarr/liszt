import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { ASTNode } from "./ASTNode";
import { BinaryOperation } from "./BinaryOperation";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeAnnotation } from "./TypeAnnotation";

export class AssignmentExpression extends ASTNode {
  constructor(
    public left: ASTNode,
    public right: ASTNode,
    public operator: string,
    start: SrcLoc,
    end: SrcLoc,
    public constant?: boolean,
    public type?: TypeAnnotation
  ) {
    super(SyntaxNodes.AssignmentExpression, start, end);
  }

  public static new(
    left: ASTNode,
    right: ASTNode,
    operator: string,
    start: SrcLoc,
    end: SrcLoc,
    constant?: boolean,
    type?: TypeAnnotation
  ) {
    return new AssignmentExpression(
      left,
      right,
      operator,
      start,
      end,
      constant,
      type
    );
  }

  public get children() {
    return [this.left, this.right];
  }
}
