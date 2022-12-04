import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { BoundASTNode } from "./BoundASTNode";
import { BoundDestructuringLHV } from "./BoundDestructuringLHV";
import { BoundIdentifier } from "./BoundIdentifier";
import { BoundNodes } from "./BoundNodes";

export class BoundTuplePattern extends BoundASTNode {
  constructor(
    public names: BoundDestructuringLHV[],
    public rest: boolean,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundTuplePattern, start, end);
  }

  public static new(
    names: BoundDestructuringLHV[],
    rest: boolean,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new BoundTuplePattern(names, rest, start, end);
  }

  public get children() {
    return this.names;
  }
}
