import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { BinaryOperation } from "./BinaryOperation";
import { Block } from "./Block";
import { SyntaxNodes } from "./SyntaxNodes";

export class ForStatement extends ASTNode {
  constructor(
    public bindings: BinaryOperation,
    public body: Block,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.ForStatement, start, end);
  }

  public static new(
    bindings: BinaryOperation,
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
