import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { Identifier } from "./Identifier";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeAnnotation } from "./TypeAnnotation";

export class ParameterType extends ASTNode {
  constructor(
    public name: Identifier,
    start: SrcLoc,
    end: SrcLoc,
    public type: TypeAnnotation
  ) {
    super(SyntaxNodes.Parameter, start, end);
  }

  public static new(
    name: Identifier,
    start: SrcLoc,
    end: SrcLoc,
    type: TypeAnnotation
  ) {
    return new ParameterType(name, start, end, type);
  }

  public get children() {
    let arr: ASTNode[] = [this.name];

    if (this.type) {
      arr.push(this.type);
    }

    return arr;
  }
}
