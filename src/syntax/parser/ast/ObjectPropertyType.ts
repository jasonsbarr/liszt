import { SrcLoc } from "../../lexer/SrcLoc";
import { AnnotatedType } from "./AnnotatedType";
import { ASTNode } from "./ASTNode";
import { Identifier } from "./Identifier";
import { SyntaxNodes } from "./SyntaxNodes";

export class ObjectPropertyType extends ASTNode {
  constructor(
    public name: Identifier,
    public type: AnnotatedType,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.ObjectPropertyType, start, end);
  }

  public static new(
    name: Identifier,
    type: AnnotatedType,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new ObjectPropertyType(name, type, start, end);
  }

  public get children() {
    return [this.name, this.type];
  }
}
