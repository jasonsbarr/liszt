import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { Identifier } from "./Identifier";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeAnnotation } from "./TypeAnnotation";

export class TypeAlias extends ASTNode {
  constructor(
    public name: Identifier,
    public base: TypeAnnotation,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.TypeAlias, start, end);
  }

  public static new(
    name: Identifier,
    base: TypeAnnotation,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new TypeAlias(name, base, start, end);
  }

  public get children() {
    return [this.base];
  }

  public toString() {
    return `TypeAlias ${this.name} - ${this.base.toString()}`;
  }
}
