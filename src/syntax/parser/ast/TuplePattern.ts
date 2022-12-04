import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { DestructuringLHV } from "./DestructuringLHV";
import { Identifier } from "./Identifier";
import { SpreadOperation } from "./SpreadOperation";
import { SyntaxNodes } from "./SyntaxNodes";

export class TuplePattern extends ASTNode {
  constructor(
    public names: DestructuringLHV[],
    public rest: boolean,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.TuplePattern, start, end);
  }

  public static new(
    names: DestructuringLHV[],
    rest: boolean,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new TuplePattern(names, rest, start, end);
  }

  public get children() {
    return this.names;
  }
}
