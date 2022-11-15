import { ASTNode } from "./ASTNode";
import { SrcLoc } from "../../lexer/SrcLoc";
import { SyntaxNodes } from "./SyntaxNodes";

export class ReturnStatement extends ASTNode {
  constructor(public expression: ASTNode, start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.ReturnStatement, start, end);
  }

  public static new(expression: ASTNode, start: SrcLoc, end: SrcLoc) {
    return new ReturnStatement(expression, start, end);
  }

  public get children() {
    return [this.expression];
  }
}
