import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { DestructuringLHV } from "./DestructuringLHV";
import { SyntaxNodes } from "./SyntaxNodes";

export class ObjectPattern extends ASTNode {
  constructor(
    public names: DestructuringLHV[],
    public rest: boolean,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.ObjectPattern, start, end);
  }

  public static new(
    names: DestructuringLHV[],
    rest: boolean,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new ObjectPattern(names, rest, start, end);
  }

  public get children() {
    return this.names;
  }
}
