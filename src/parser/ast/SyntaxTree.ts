import { DiagnosticBag } from "../../diagnostics/DiagnosticBag";
import { TokenBag } from "../../lexer/TokenBag";
import { ASTNode } from "./ASTNode";

export class SyntaxTree {
  public diagnostics;

  constructor(
    public root: ASTNode,
    public tokens: TokenBag,
    diagnostics: DiagnosticBag,
    public source: string,
    public file: string
  ) {
    this.diagnostics = DiagnosticBag.from(diagnostics);
  }

  public static new(
    root: ASTNode,
    tokens: TokenBag,
    diagnostics: DiagnosticBag,
    source: string,
    file: string
  ) {
    return new SyntaxTree(root, tokens, diagnostics, source, file);
  }
}
