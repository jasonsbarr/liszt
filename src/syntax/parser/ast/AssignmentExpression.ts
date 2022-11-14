import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class AssignmentExpression extends ASTNode {
  constructor(
    public lhv: ASTNode,
    public rhv: ASTNode,
    public assignType: Token,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.AssignmentExpression, start, end);
  }

  public new(
    lhv: ASTNode,
    rhv: ASTNode,
    assignType: Token,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new AssignmentExpression(lhv, rhv, assignType, start, end);
  }

  public get children() {
    return [this.lhv, this.rhv];
  }
}
