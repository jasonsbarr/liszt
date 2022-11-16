import { SrcLoc } from "../../lexer/SrcLoc";
import { ASTNode } from "./ASTNode";
import { ParameterType } from "./ParameterType";
import { SyntaxNodes } from "./SyntaxNodes";
import { TypeAnnotation } from "./TypeAnnotation";

export class FunctionType extends ASTNode {
  constructor(
    public parameters: ParameterType[],
    public returnType: TypeAnnotation,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.FunctionType, start, end);
  }

  public static new(
    parameters: ParameterType[],
    returnType: TypeAnnotation,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new FunctionType(parameters, returnType, start, end);
  }

  public get children() {
    return [];
  }

  toString(): string {
    return `(${this.parameters
      .map((p) => p.name + ":" + p.type.toString())
      .join(", ")} => ${this.returnType.toString()})`;
  }
}
