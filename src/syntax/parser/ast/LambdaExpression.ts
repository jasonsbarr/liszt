import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { Parameter } from "./Parameter";
import { SyntaxNodes } from "./SyntaxNodes";

export class LambdaExpression extends ASTNode {
  constructor(
    public params: Parameter[],
    public body: ASTNode,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.LambdaExpression, start, end);
  }

  public static new(
    params: Parameter[],
    body: ASTNode,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new LambdaExpression(params, body, start, end);
  }

  public get children() {
    return [this.params, this.body];
  }
}
