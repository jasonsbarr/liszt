import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class TypeVariable extends ASTNode {
  constructor(public name: string, start: SrcLoc, end: SrcLoc) {
    super(SyntaxNodes.TypeVariable, start, end);
  }

  public static new(name: string, start: SrcLoc, end: SrcLoc) {
    return new TypeVariable(name, start, end);
  }

  public get children() {
    return [];
  }

  public toString() {
    return `TypeVariable '${this.name}`;
  }
}
