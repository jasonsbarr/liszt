import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class Block extends ASTNode {
  constructor(
    public expressions: ASTNode[],
    start: SrcLoc,
    end: SrcLoc,
    public statement = false
  ) {
    super(SyntaxNodes.Block, start, end);
  }

  public static new(
    exprs: ASTNode[],
    start: SrcLoc,
    end: SrcLoc,
    statement = false
  ) {
    return new Block(exprs, start, end, statement);
  }

  public get children() {
    return this.expressions;
  }
}
