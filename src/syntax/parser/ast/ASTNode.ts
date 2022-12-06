import { PrettyPrintable } from "../../../utils/PrettyPrintable";
import { SrcLoc } from "../../lexer/SrcLoc";
import { SyntaxNodes } from "./SyntaxNodes";

export abstract class ASTNode implements PrettyPrintable {
  public kind: SyntaxNodes;
  public start: SrcLoc;
  public end: SrcLoc;

  constructor(kind: SyntaxNodes, start: SrcLoc, end: SrcLoc) {
    this.kind = kind;
    this.start = start;
    this.end = end;
  }

  public abstract get children(): (ASTNode | ASTNode[])[];

  public toString() {
    return String(this.kind);
  }
}
