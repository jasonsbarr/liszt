import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { BoundNodes } from "./BoundNodes";

export abstract class BoundASTNode {
  constructor(
    public kind: BoundNodes,
    public start: SrcLoc,
    public end: SrcLoc
  ) {}

  public abstract get children(): BoundASTNode[];

  public abstract toString(): string;
}
