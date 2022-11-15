import { SrcLoc } from "../../lexer/SrcLoc";
import { AnnotatedType } from "./AnnotatedType";
import { ASTNode } from "./ASTNode";
import { ParameterType } from "./ParameterType";
import { SyntaxNodes } from "./SyntaxNodes";

export class FunctionType extends ASTNode {
  constructor(
    public parameters: ParameterType[],
    public returnType: AnnotatedType,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(SyntaxNodes.FunctionType, start, end);
  }

  public static new(
    parameters: ParameterType[],
    returnType: AnnotatedType,
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
