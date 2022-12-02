import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class ArrayLiteral extends ASTNode {
  constructor(public members: ASTNode[], start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.ArrayLiteral, start, end);
  }

  public static new(members: ASTNode[], start: SrcLoc, end: SrcLoc) {
    return new ArrayLiteral(members, start, end);
  }

  public get children() {
    return this.members;
  }

  public toString() {
    return `[${this.members.map((m) => String(m)).join(", ")}]`;
  }
}
