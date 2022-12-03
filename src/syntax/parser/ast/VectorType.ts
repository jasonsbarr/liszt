import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeAnnotation } from "./TypeAnnotation";

export class VectorType extends ASTNode {
  constructor(public type: TypeAnnotation, start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.VectorType, start, end);
  }

  public static new(type: TypeAnnotation, start: SrcLoc, end: SrcLoc) {
    return new VectorType(type, start, end);
  }

  public get children() {
    return [];
  }

  public toString() {
    return `VectorType ${this.type}`;
  }
}
