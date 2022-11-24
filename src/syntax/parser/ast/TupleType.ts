import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeAnnotation } from "./TypeAnnotation";

export class TupleType extends ASTNode {
  constructor(public types: TypeAnnotation[], start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.TupleType, start, end);
  }

  public static new(types: TypeAnnotation[], start: SrcLoc, end: SrcLoc) {
    return new TupleType(types, start, end);
  }

  public get children() {
    return this.types;
  }

  public toString() {
    return `TupleType (${this.types.map((t) => t.toString()).join(", ")})`;
  }
}
