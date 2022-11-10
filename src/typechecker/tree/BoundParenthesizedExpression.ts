import { ParenthesizedExpression } from "../../syntax/parser/ast/ParenthesizedExpression";
import { bind } from "../bind";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundParenthesizedExpression extends BoundASTNode {
  public expression: BoundASTNode;
  constructor(node: ParenthesizedExpression) {
    super(BoundNodes.BoundParenthesizedExpression, node.start, node.end);
    this.expression = bind(node.expression);
  }

  public static new(node: ParenthesizedExpression) {
    return new BoundParenthesizedExpression(node);
  }

  public get children() {
    return [this.expression];
  }
}
