export class ProgramNode {
  public type = "Program";
  private _children: SyntaxNode[];

  constructor() {
    this._children = [];
  }

  public static new() {
    return new ProgramNode();
  }

  public append(node: SyntaxNode) {
    this._children.push(node);
  }

  public get children() {
    return this._children;
  }
}

export type SyntaxNode = {
  ProgramNode: ProgramNode;
};
