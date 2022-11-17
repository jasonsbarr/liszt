import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class UnaryOperation extends ASTNode {
  constructor(
    public expression: ASTNode,
    public operator: string,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.UnaryOperation, start, end);
  }

  public static new(
    expression: ASTNode,
    operator: string,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new UnaryOperation(expression, operator, start, end);
  }

  public get children() {
    return [this.expression];
  }
}
