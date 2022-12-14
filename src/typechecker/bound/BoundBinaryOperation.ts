import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundBinaryOperation extends BoundASTNode {
  constructor(
    public left: BoundASTNode,
    public right: BoundASTNode,
    public operator: string,
    start: SrcLoc,
    end: SrcLoc,
    public type: Type,
    name?: BoundNodes
  ) {
    super(name ?? BoundNodes.BoundBinaryOperation, start, end);
  }

  public static new(
    left: BoundASTNode,
    right: BoundASTNode,
    operator: string,
    start: SrcLoc,
    end: SrcLoc,
    type: Type,
    name?: BoundNodes
  ) {
    return new BoundBinaryOperation(
      left,
      right,
      operator,
      start,
      end,
      type,
      name
    );
  }

  public get children() {
    return [this.left, this.right];
  }
}
