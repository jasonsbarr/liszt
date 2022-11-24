import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class Tuple extends ASTNode {
  constructor(public values: ASTNode[], start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.Tuple, start, end);
  }

  public static new(values: ASTNode[], start: SrcLoc, end: SrcLoc) {
    return new Tuple(values, start, end);
  }

  public get children() {
    return this.values;
  }

  public toString() {
    return "Tuple";
  }
}
