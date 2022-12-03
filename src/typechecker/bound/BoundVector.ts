import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundVector extends BoundASTNode {
  constructor(
    public members: BoundASTNode[],
    public type: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundVector, start, end);
  }

  public static new(
    members: BoundASTNode[],
    type: Type,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new BoundVector(members, type, start, end);
  }

  public get children() {
    return this.members;
  }

  public toString() {
    return `BoundVector [${this.members.map((m) => String(m)).join(", ")}]`;
  }
}
