import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class BinaryOperation extends ASTNode {
  constructor(
    public left: ASTNode,
    public right: ASTNode,
    public operator: Token,
    start: SrcLoc,
    end: SrcLoc,
    name?: SyntaxNodes
  ) {
    super(name ?? SyntaxNodes.BinaryOp, start, end);
  }

  public get children() {
    return [this.left, this.right];
  }
}
