import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeAnnotation } from "./TypeAnnotation";

export class CompoundType extends ASTNode {
  constructor(
    name: SyntaxNodes,
    public types: TypeAnnotation[],
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(name, start, end);
  }

  public static new(
    name: SyntaxNodes,
    types: TypeAnnotation[],
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new CompoundType(name, types, start, end);
  }

  public get children() {
    return [this.types];
  }
}
