import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundUnaryOperation extends BoundASTNode {
  constructor(
    public expression: BoundASTNode,
    public operator: string,
    start: SrcLoc,
    end: SrcLoc,
    public type: Type
  ) {
    super(BoundNodes.BoundUnaryOperation, start, end);
  }

  public static new(
    expression: BoundASTNode,
    operator: string,
    start: SrcLoc,
    end: SrcLoc,
    type: Type
  ) {
    return new BoundUnaryOperation(expression, operator, start, end, type);
  }

  public get children() {
    return [this.expression];
  }
}
