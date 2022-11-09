import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { Identifier } from "./Identifier";
import { SyntaxNodes } from "./SyntaxNodes";

export class MemberExpression extends ASTNode {
  constructor(
    public object: ASTNode,
    public property: Identifier,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.MemberExpression, start, end);
  }

  public static new(
    object: ASTNode,
    property: Identifier,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new MemberExpression(object, property, start, end);
  }

  public get children() {
    return [this.object, this.property];
  }

  public toString() {
    return "MemberExpression";
  }
}
