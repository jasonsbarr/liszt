import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { Parameter } from "./Parameter";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeAnnotation } from "./TypeAnnotation";

export class LambdaExpression extends ASTNode {
  constructor(
    public params: Parameter[],
    public body: ASTNode,
    start: SrcLoc,
    end: SrcLoc,
    public ret?: TypeAnnotation
  ) {
    super(SyntaxNodes.LambdaExpression, start, end);
  }

  public static new(
    params: Parameter[],
    body: ASTNode,
    start: SrcLoc,
    end: SrcLoc,
    ret?: TypeAnnotation
  ) {
    return new LambdaExpression(params, body, start, end, ret);
  }

  public get children() {
    return [this.params, this.body];
  }
}
