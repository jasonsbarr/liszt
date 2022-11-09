import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class TypeLiteral extends ASTNode {
  constructor(public properties: ASTNode[], start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.TypeLiteral, start, end);
  }

  public static new(properties: ASTNode[], start: SrcLoc, end: SrcLoc) {
    return new TypeLiteral(properties, start, end);
  }

  public get children() {
    return this.properties;
  }

  public toString() {
    return "TypeLiteral";
  }
}
