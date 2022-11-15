import { ASTNode } from "./ASTNode";
import { Block } from "./Block";
import { Parameter } from "./Parameter";
import { SrcLoc } from "../../lexer/SrcLoc";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeAnnotation } from "./TypeAnnotation";
import { Identifier } from "./Identifier";

export class FunctionDeclaration extends ASTNode {
  constructor(
    public name: Identifier,
    public params: Parameter[],
    public body: Block,
    start: SrcLoc,
    end: SrcLoc,
    public ret?: TypeAnnotation
  ) {
    super(SyntaxNodes.FunctionDeclaration, start, end);
  }

  public static new(
    name: Identifier,
    params: Parameter[],
    body: Block,
    start: SrcLoc,
    end: SrcLoc,
    ret?: TypeAnnotation
  ) {
    return new FunctionDeclaration(name, params, body, start, end, ret);
  }

  public get children() {
    return [this.params, this.body];
  }
}
