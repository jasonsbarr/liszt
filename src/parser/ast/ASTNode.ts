import { SrcLoc } from "../../lexer/SrcLoc";
import { SyntaxNodes } from "./SyntaxNodes";

export abstract class ASTNode {
  public type: string;
  public start: SrcLoc;
  public end?: SrcLoc;

  constructor(type: SyntaxNodes, start: SrcLoc, end?: SrcLoc) {
    this.type = type;
    this.start = start;
    this.end = end;
  }

  public abstract get children(): ASTNode[];

  public abstract toString(): string;
}
