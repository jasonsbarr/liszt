import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class VectorLiteral extends ASTNode {
  constructor(public members: ASTNode[], start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.VectorLiteral, start, end);
  }

  public static new(members: ASTNode[], start: SrcLoc, end: SrcLoc) {
    return new VectorLiteral(members, start, end);
  }

  public get children() {
    return this.members;
  }

  public toString() {
    return `[${this.members.map((m) => String(m)).join(", ")}]`;
  }
}
