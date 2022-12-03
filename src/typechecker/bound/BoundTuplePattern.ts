import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { BoundASTNode } from "./BoundASTNode";
import { BoundIdentifier } from "./BoundIdentifier";
import { BoundNodes } from "./BoundNodes";

export class BoundTuplePattern extends BoundASTNode {
  constructor(
    public names: (BoundIdentifier | BoundTuplePattern)[],
    public rest: boolean,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundTuplePattern, start, end);
  }

  public static new(
    names: (BoundIdentifier | BoundTuplePattern)[],
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
