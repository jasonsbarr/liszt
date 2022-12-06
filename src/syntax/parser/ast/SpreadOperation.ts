import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class SpreadOperation extends ASTNode {
  constructor(public expression: ASTNode, start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.SpreadOperation, start, end);
  }

  public static new(expression: ASTNode, start: SrcLoc, end: SrcLoc) {
    return new SpreadOperation(expression, start, end);
  }

  public get children() {
    return [this.expression];
  }
}
