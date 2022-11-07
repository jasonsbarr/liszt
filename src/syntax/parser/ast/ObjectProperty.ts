import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class ObjectProperty extends ASTNode {
  constructor(
    public key: ASTNode,
    public value: ASTNode,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.ObjectProperty, start, end);
  }

  public static new(key: ASTNode, value: ASTNode, start: SrcLoc, end: SrcLoc) {
    return new ObjectProperty(key, value, start, end);
  }

  public get children(): ASTNode[] {
    return [this.key, this.value];
  }

  public toString() {
    return `ObjectProperty ${this.key}: ${this.value}`;
  }
}
