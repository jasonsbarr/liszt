import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class ProgramNode extends ASTNode {
  private _children: ASTNode[];

  constructor(start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.ProgramNode, start, end);
    this._children = [];
  }

  public static new(start: SrcLoc, end: SrcLoc) {
    return new ProgramNode(start, end);
  }

  public append(node: ASTNode) {
    this._children.push(node);
  }

  public get children() {
    return this._children;
  }

  public toString() {
    return "ProgramNode";
  }
}
