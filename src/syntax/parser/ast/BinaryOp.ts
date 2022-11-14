import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class BinaryOp extends ASTNode {
  constructor(
    public left: ASTNode,
    public right: ASTNode,
    public operator: Token,
    name: SyntaxNodes,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(name, start, end);
  }

  public get children() {
    return [this.left, this.right];
  }
}
