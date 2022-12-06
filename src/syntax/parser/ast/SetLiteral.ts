import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class SetLiteral extends ASTNode {
  constructor(public members: ASTNode[], start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.SetLiteral, start, end);
  }

  public static new(members: ASTNode[], start: SrcLoc, end: SrcLoc) {
    return new SetLiteral(members, start, end);
  }

  public get children() {
    return this.members;
  }
}
