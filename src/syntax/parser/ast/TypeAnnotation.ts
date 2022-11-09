import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { BooleanKeyword } from "./BooleanKeyword";
import { FloatKeyword } from "./FloatKeyword";
import { Identifier } from "./Identifier";
import { IntegerKeyword } from "./IntegerKeyword";
import { NilLiteral } from "./NilLiteral";
import { StringKeyword } from "./StringKeyword";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeLiteral } from "./TypeLiteral";

type AnnotatedType =
  | IntegerKeyword
  | FloatKeyword
  | BooleanKeyword
  | StringKeyword
  | NilLiteral
  | Identifier
  | TypeLiteral;

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
