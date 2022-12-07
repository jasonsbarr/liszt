import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { BoundASTNode } from "./BoundASTNode";
import { BoundDestructuringLHV } from "./BoundDestructuringLHV";
import { BoundNodes } from "./BoundNodes";

export class BoundObjectPattern extends BoundASTNode {
  constructor(
    public names: BoundDestructuringLHV[],
    public rest: boolean,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundObjectPattern, start, end);
  }

  public static new(
    names: BoundDestructuringLHV[],
    rest: boolean,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new BoundObjectPattern(names, rest, start, end);
  }

  public get children() {
    return this.names;
  }
}
