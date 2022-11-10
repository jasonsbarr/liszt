import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { PrettyPrintable } from "../../utils/PrettyPrintable";
import { BoundNodes } from "./BoundNodes";

export abstract class BoundASTNode implements PrettyPrintable {
  constructor(
    public kind: BoundNodes,
    public start: SrcLoc,
    public end: SrcLoc
  ) {}

  public abstract get children(): (BoundASTNode | BoundASTNode[])[];

  public toString() {
    return String(this.kind);
  }
}
