import { ASTNode } from "./ASTNode";

export class ProgramNode extends ASTNode {
  private _children: ASTNode[];

  constructor() {
    super("ProgramNode");
    this._children = [];
  }

  public static new() {
    return new ProgramNode();
  }

  public append(node: ASTNode) {
    this._children.push(node);
  }

  public get children() {
    return this._children;
  }
}
