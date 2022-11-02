import { DiagnosticBag } from "../../diagnostics/DiagnosticBag";
import { TokenBag } from "../../lexer/TokenBag";
import { SyntaxTree } from "../../parser/ast/SyntaxTree";
import { BoundProgramNode } from "./BoundProgramNode";

export class BoundTree extends SyntaxTree {
  constructor(
    root: BoundProgramNode,
    tokens: TokenBag,
    diagnostics: DiagnosticBag,
    source: string,
    file: string
  ) {
    super(root, tokens, diagnostics, source, file);
  }

  public static new(
    root: BoundProgramNode,
    tokens: TokenBag,
    diagnostics: DiagnosticBag,
    source: string,
    file: string
  ) {
    return new BoundTree(root, tokens, diagnostics, source, file);
  }
}
