import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class ParenthesizedExpression extends ASTNode {
  constructor(public expression: ASTNode, start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.ParenthesizedExpression, start, end);
  }

  public static new(expression: ASTNode, start: SrcLoc, end: SrcLoc) {
    return new ParenthesizedExpression(expression, start, end);
  }

  public get children() {
    return [this.expression];
  }

  public toString() {
    return "ParenthesizedExpression";
  }
}
