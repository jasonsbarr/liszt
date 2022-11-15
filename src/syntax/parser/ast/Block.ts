import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class Block extends ASTNode {
  constructor(public expressions: ASTNode[], start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.Block, start, end);
  }

  public static new(exprs: ASTNode[], start: SrcLoc, end: SrcLoc) {
    return new Block(exprs, start, end);
  }

  public get children() {
    return this.expressions;
  }
}
