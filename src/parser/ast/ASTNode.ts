export abstract class ASTNode {
  public type: string;

  constructor(type: string) {
    this.type = type;
  }

  public abstract get children(): ASTNode[];
}
