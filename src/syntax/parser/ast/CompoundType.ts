import { SrcLoc } from "../../lexer/SrcLoc";
import { AnnotatedType } from "./AnnotatedType";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class CompoundType extends ASTNode {
  constructor(
    name: SyntaxNodes,
    public types: AnnotatedType[],
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(name, start, end);
  }

  public static new(
    name: SyntaxNodes,
    types: AnnotatedType[],
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new CompoundType(name, types, start, end);
  }

  public get children() {
    return [this.types];
  }
}
