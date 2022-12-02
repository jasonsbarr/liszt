import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class SliceExpression extends ASTNode {
  constructor(
    public obj: ASTNode,
    public index: ASTNode,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.SliceExpression, start, end);
  }

  public static new(obj: ASTNode, index: ASTNode, start: SrcLoc, end: SrcLoc) {
    return new SliceExpression(obj, index, start, end);
  }

  public get children() {
    return [];
  }

  public toString() {
    return `SliceExpression ${this.obj}[${this.index}]`;
  }
}
