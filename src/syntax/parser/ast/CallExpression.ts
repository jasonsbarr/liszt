import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class CallExpression extends ASTNode {
  constructor(
    public func: ASTNode,
    public args: ASTNode[],
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.CallExpression, start, end);
  }

  public static new(
    func: ASTNode,
    args: ASTNode[],
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new CallExpression(func, args, start, end);
  }

  public get children() {
    return [this.func, this.args];
  }
}
