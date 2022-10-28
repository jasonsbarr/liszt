import { DiagnosticBag } from "../diagnostics/DiagnosticBag";
import { TokenBag } from "./TokenBag";

export class LexResult {
  constructor(
    public tokens: TokenBag,
    public diagnostics: DiagnosticBag,
    public file: string
  ) {}

  public static create(
    tokens: TokenBag,
    diagnostics: DiagnosticBag,
    file: string
  ) {
    return new LexResult(tokens, diagnostics, file);
  }
}
