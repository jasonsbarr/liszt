import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { Identifier } from "./Identifier";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeAnnotation } from "./TypeAnnotation";

export class TypeAlias extends ASTNode {
  constructor(
    public name: Identifier,
    public type: TypeAnnotation,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.TypeAlias, start, end);
  }

  public static new(
    name: Identifier,
    type: TypeAnnotation,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new TypeAlias(name, type, start, end);
  }

  public get children() {
    return [this.type];
  }

  public toString() {
    return `TypeAlias ${this.name} - ${this.type.toString()}`;
  }
}
