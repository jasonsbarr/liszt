import { DiagnosticBag } from "../../diagnostics/DiagnosticBag";
import { LexResult } from "../../lexer/LexResult";
import { ASTNode } from "./ASTNode";

export class SyntaxTree {
  constructor(
    public root: ASTNode,
    public diagnostics: DiagnosticBag,
    public lexResult: LexResult
  ) {}

  public static new(
    root: ASTNode,
    diagnostics: DiagnosticBag,
    lexResult: LexResult
  ) {
    return new SyntaxTree(root, diagnostics, lexResult);
  }
}
