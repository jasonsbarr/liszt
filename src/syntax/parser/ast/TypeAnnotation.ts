import { SrcLoc } from "../../lexer/SrcLoc";
import { AnnotatedType } from "./AnnotatedType";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class TypeAnnotation extends ASTNode {
  constructor(public type: AnnotatedType, start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.TypeAnnotation, start, end);
  }

  public static new(type: AnnotatedType, start: SrcLoc, end: SrcLoc) {
    return new TypeAnnotation(type, start, end);
  }

  public get children() {
    return [this.type];
  }

  public toString() {
    return "TypeAnnotation";
  }
}
