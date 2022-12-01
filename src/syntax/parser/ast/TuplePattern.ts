import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { Identifier } from "./Identifier";
import { SyntaxNodes } from "./SyntaxNodes";

export class TuplePattern extends ASTNode {
  constructor(public names: Identifier[], start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.TuplePattern, start, end);
  }

  public static new(names: Identifier[], start: SrcLoc, end: SrcLoc) {
    return new TuplePattern(names, start, end);
  }

  public get children() {
    return this.names;
  }
}
