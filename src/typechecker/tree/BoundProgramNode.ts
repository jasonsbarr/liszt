import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundProgramNode extends BoundASTNode {
  private _children: BoundASTNode[];
  constructor(start: SrcLoc, end: SrcLoc) {
    super(BoundNodes.BoundProgramNode, start, end);
    this.kind = BoundNodes.BoundProgramNode;
    this._children = [];
  }

  public static new(start: SrcLoc, end: SrcLoc) {
    return new BoundProgramNode(start, end);
  }

  public get children() {
    return this._children;
  }

  public append(node: BoundASTNode) {
    this._children.push(node);
  }

  public toString() {
    return "BoundProgramNode";
  }
}
