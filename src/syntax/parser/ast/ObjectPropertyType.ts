import { SrcLoc } from "../../lexer/SrcLoc";
import { AnnotatedType } from "./AnnotatedType";
import { ASTNode } from "./ASTNode";
import { Identifier } from "./Identifier";
import { SyntaxNodes } from "./SyntaxNodes";

export class ObjectPropertyType extends ASTNode {
  public name: string;

  constructor(
    public nameAST: Identifier,
    public type: AnnotatedType,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.ObjectPropertyType, start, end);
    this.name = nameAST.name;
  }

  public static new(
    nameAST: Identifier,
    type: AnnotatedType,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new ObjectPropertyType(nameAST, type, start, end);
  }

  public get children() {
    return [this.nameAST, this.type];
  }
}
