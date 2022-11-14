import { SrcLoc } from "../../lexer/SrcLoc";
import { AssignmentExpression } from "./AssignmentExpression";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class VariableDeclaration extends ASTNode {
  constructor(
    public assignment: AssignmentExpression,
    public constant: boolean,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.VariableDeclaration, start, end);
  }

  public static new(
    assignment: AssignmentExpression,
    constant: boolean,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new VariableDeclaration(assignment, constant, start, end);
  }

  public get children() {
    return [this.assignment];
  }
}
