import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Type } from "../Type";
import { BoundAssignmentExpression } from "./BoundAssignmentExpression";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundVariableDeclaration extends BoundASTNode {
  constructor(
    public assignment: BoundAssignmentExpression,
    public constant: boolean,
    public type: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundVariableDeclaration, start, end);
  }

  public static new(
    assignment: BoundAssignmentExpression,
    constant: boolean,
    type: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new BoundVariableDeclaration(assignment, constant, type, start, end);
  }

  public get children() {
    return [this.assignment];
  }
}
