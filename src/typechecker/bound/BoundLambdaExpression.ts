import { LambdaExpression } from "../../syntax/parser/ast/LambdaExpression";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";
import { BoundParameter } from "./BoundParameter";

export class BoundLambdaExpression extends BoundASTNode {
  public args: BoundParameter[];

  constructor(
    node: LambdaExpression,
    public body: BoundASTNode,
    public type: Type.Function
  ) {
    super(BoundNodes.BoundLambdaExpression, node.start, node.end);
    this.args = node.params.map((param) => BoundParameter.new(param));
  }

  public static new(
    node: LambdaExpression,
    body: BoundASTNode,
    type: Type.Function
  ) {
    return new BoundLambdaExpression(node, body, type);
  }

  public get children() {
    return [this.args as BoundASTNode[], this.body];
  }
}
