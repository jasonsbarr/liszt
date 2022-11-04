import { DiagnosticBag } from "../../diagnostics/DiagnosticBag";
import { TokenBag } from "./TokenBag";

export class LexResult {
  constructor(
    public tokens: TokenBag,
    public diagnostics: DiagnosticBag,
    public file: string,
    public source: string
  ) {}

  public static new(
    tokens: TokenBag,
    diagnostics: DiagnosticBag,
    file: string,
    source: string
  ) {
    return new LexResult(tokens, diagnostics, file, source);
  }
}
