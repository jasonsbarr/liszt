import { ParenthesizedExpression } from "../../syntax/parser/ast/ParenthesizedExpression";
import { bind } from "../bind";
import { TypeEnv } from "../TypeEnv";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundParenthesizedExpression extends BoundASTNode {
  public expression: BoundASTNode;
  constructor(node: ParenthesizedExpression, env: TypeEnv) {
    super(BoundNodes.BoundParenthesizedExpression, node.start, node.end);
    this.expression = bind(node.expression, env);
  }

  public static new(node: ParenthesizedExpression, env: TypeEnv) {
    return new BoundParenthesizedExpression(node, env);
  }

  public get children() {
    return [this.expression];
  }
}
