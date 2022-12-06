import { DiagnosticBag } from "../../diagnostics/DiagnosticBag";
import { TokenBag } from "../../syntax/lexer/TokenBag";
import { SyntaxTree } from "../../syntax/parser/ast/SyntaxTree";
import { BoundProgramNode } from "./BoundProgramNode";

export class BoundTree {
  constructor(
    public root: BoundProgramNode,
    public tokens: TokenBag,
    public diagnostics: DiagnosticBag,
    public source: string,
    public file: string
  ) {}

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
