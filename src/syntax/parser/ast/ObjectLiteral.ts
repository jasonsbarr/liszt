import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { ObjectProperty } from "./ObjectProperty";
import { SyntaxNodes } from "./SyntaxNodes";

export class ObjectLiteral extends ASTNode {
  constructor(public properties: ObjectProperty[], start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.ObjectLiteral, start, end);
  }

  public static new(properties: ObjectProperty[], start: SrcLoc, end: SrcLoc) {
    return new ObjectLiteral(properties, start, end);
  }

  public get children() {
    return this.properties;
  }

  public toString() {
    return "ObjectLiteral";
  }
}
