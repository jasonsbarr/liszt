import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundParenthesizedExpression extends BoundASTNode {
  constructor(public expression: BoundASTNode, start: SrcLoc, end: SrcLoc) {
    super(BoundNodes.BoundParenthesizedExpression, start, end);
  }

  public static new(expression: BoundASTNode, start: SrcLoc, end: SrcLoc) {
    return new BoundParenthesizedExpression(expression, start, end);
  }

  public get children() {
    return [this.expression];
  }
}
