import { SrcLoc } from "../../lexer/SrcLoc";
import { ProgramNode } from "../../parser/ast/ProgramNode";
import { BoundNodes } from "./BoundNodes";

export class BoundProgramNode extends ProgramNode {
  constructor(start: SrcLoc, end: SrcLoc) {
    super(start, end);
    this.kind = BoundNodes.BoundProgramNode;
  }

  public static new(start: SrcLoc, end: SrcLoc) {
    return new BoundProgramNode(start, end);
  }
}
