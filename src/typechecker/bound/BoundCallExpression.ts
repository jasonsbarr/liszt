import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundCallExpression extends BoundASTNode {
  constructor(
    public args: BoundASTNode[],
    public func: BoundASTNode,
    public type: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundCallExpression, start, end);
  }

  public static new(
    args: BoundASTNode[],
    func: BoundASTNode,
    type: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new BoundCallExpression(args, func, type, start, end);
  }

  public get children() {
    return [this.args, this.func];
  }

  public toString() {
    return `CallExpression ${this.type}`;
  }
}
