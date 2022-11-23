import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class IfExpression extends ASTNode {
  public else: ASTNode;

  constructor(
    public test: ASTNode,
    public then: ASTNode,
    elseNode: ASTNode,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.IfExpression, start, end);
    this.else = elseNode;
  }

  public static new(
    test: ASTNode,
    then: ASTNode,
    elseNode: ASTNode,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new IfExpression(test, then, elseNode, start, end);
  }

  public get children() {
    return [this.test, this.then, this.else];
  }
}
