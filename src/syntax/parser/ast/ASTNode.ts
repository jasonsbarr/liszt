import { SrcLoc } from "../../lexer/SrcLoc";
import { SyntaxNodes } from "./SyntaxNodes";

export abstract class ASTNode {
  public kind: string;
  public start: SrcLoc;
  public end: SrcLoc;

  constructor(kind: SyntaxNodes, start: SrcLoc, end: SrcLoc) {
    this.kind = kind;
    this.start = start;
    this.end = end;
  }

  public abstract get children(): ASTNode[];

  public abstract toString(): string;
}
