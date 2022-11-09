import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeAnnotation } from "./TypeAnnotation";

export class AsExpression extends ASTNode {
  constructor(
    public expression: ASTNode,
    public type: TypeAnnotation,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.AsExpression, start, end);
  }

  public static new(
    expression: ASTNode,
    type: TypeAnnotation,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new AsExpression(expression, type, start, end);
  }

  public get children() {
    return [this.expression, this.type];
  }

  public toString() {
    return "AsExpression";
  }
}
