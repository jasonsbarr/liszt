import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class BinaryOperation extends ASTNode {
  constructor(
    public left: ASTNode,
    public right: ASTNode,
    public operator: string,
    start: SrcLoc,
    end: SrcLoc,
    name?: SyntaxNodes
  ) {
    super(name ?? SyntaxNodes.BinaryOperation, start, end);
  }

  public static new(
    left: ASTNode,
    right: ASTNode,
    operator: string,
    start: SrcLoc,
    end: SrcLoc,
    name?: SyntaxNodes
  ) {
    return new BinaryOperation(left, right, operator, start, end, name);
  }

  public get children() {
    return [this.left, this.right];
  }
}
