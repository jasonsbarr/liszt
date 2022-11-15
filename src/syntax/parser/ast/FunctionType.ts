import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { Parameter } from "./Parameter";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeAnnotation } from "./TypeAnnotation";

export class FunctionType extends ASTNode {
  constructor(
    public parameters: Parameter[],
    public returnType: TypeAnnotation,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.FunctionType, start, end);
  }

  public static new(
    parameters: Parameter[],
    returnType: TypeAnnotation,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new FunctionType(parameters, returnType, start, end);
  }

  public get children() {
    return [this.parameters, this.returnType];
  }
}
