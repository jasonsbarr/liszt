import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { Block } from "./Block";
import { SyntaxNodes } from "./SyntaxNodes";

export class ForStatement extends ASTNode {
  constructor(
    public bindings: ASTNode,
    public body: Block,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.ForStatement, start, end);
  }

  public static new(
    bindings: ASTNode,
    body: Block,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new ForStatement(bindings, body, start, end);
  }

  public get children() {
    return this.body.expressions;
  }
}
