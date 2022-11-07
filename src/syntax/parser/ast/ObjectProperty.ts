import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { Identifier } from "./Identifier";
import { SyntaxNodes } from "./SyntaxNodes";

export class ObjectProperty extends ASTNode {
  constructor(
    public key: Identifier,
    public value: ASTNode,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.ObjectProperty, start, end);
  }

  public static new(
    key: Identifier,
    value: ASTNode,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new ObjectProperty(key, value, start, end);
  }

  public get children(): ASTNode[] {
    return [this.key, this.value];
  }

  public toString() {
    return "ObjectProperty";
  }
}
