import { SyntaxNodes } from "./SyntaxNodes";

export abstract class ASTNode {
  public type: string;

  constructor(type: SyntaxNodes) {
    this.type = type;
  }

  public abstract get children(): ASTNode[];
}
