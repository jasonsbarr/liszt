import { LambdaExpression } from "../../syntax/parser/ast/LambdaExpression";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";
import { BoundParameter } from "./BoundParameter";

export class BoundLambdaExpression extends BoundASTNode {
  constructor(
    node: LambdaExpression,
    public body: BoundASTNode,
    public type: Type.Function,
    public args: BoundParameter[]
  ) {
    super(BoundNodes.BoundLambdaExpression, node.start, node.end);
  }

  public static new(
    node: LambdaExpression,
    body: BoundASTNode,
    type: Type.Function,
    args: BoundParameter[]
  ) {
    return new BoundLambdaExpression(node, body, type, args);
  }

  public get children() {
    return [this.args as BoundASTNode[], this.body];
  }
}
