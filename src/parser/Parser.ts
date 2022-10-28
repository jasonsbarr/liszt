import { DiagnosticBag } from "../diagnostics/DiagnosticBag";
import { LexResult } from "../lexer/LexResult";
import { TokenBag } from "../lexer/TokenBag";

export class BaseParser {
  protected lexResult: LexResult;
  protected tokens: TokenBag;
  protected diagnostics: DiagnosticBag;

  constructor(lexResult: LexResult) {
    this.lexResult = lexResult;
    this.tokens = lexResult.tokens;
    this.diagnostics = DiagnosticBag.new();
  }
}
