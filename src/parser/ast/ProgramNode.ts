import { ASTNode } from "./ASTNode";

export class ProgramNode extends ASTNode {
  public type = "Program";
  private _children: ASTNode[];

  constructor() {
    super();
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
