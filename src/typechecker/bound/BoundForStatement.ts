import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { BoundASTNode } from "./BoundASTNode";
import { BoundBlock } from "./BoundBlock";
import { BoundNodes } from "./BoundNodes";

export class BoundForStatement extends BoundASTNode {
  constructor(
    public bindings: BoundASTNode,
    public body: BoundBlock,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundForStatement, start, end);
  }

  public static new(
    bindings: BoundASTNode,
    body: BoundBlock,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new BoundForStatement(bindings, body, start, end);
  }

  public get children() {
    return this.body.expressions;
  }
}
