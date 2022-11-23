import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundIfExpression extends BoundASTNode {
  public else: BoundASTNode;

  constructor(
    public test: BoundASTNode,
    public then: BoundASTNode,
    elseNode: BoundASTNode,
    public type: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundIfExpression, start, end);
    this.else = elseNode;
  }

  public static new(
    test: BoundASTNode,
    then: BoundASTNode,
    elseNode: BoundASTNode,
    type: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new BoundIfExpression(test, then, elseNode, type, start, end);
  }

  public get children() {
    return [this.test, this.then, this.else];
  }
}
