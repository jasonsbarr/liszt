import { DiagnosticBag } from "../../diagnostics/DiagnosticBag";
import { LexResult } from "../lexer/LexResult";
import { ASTNode } from "./ast/ASTNode";
import { Reader } from "./Reader";

export abstract class BaseParser {
  protected lexResult: LexResult;
  protected reader: Reader;
  protected diagnostics: DiagnosticBag;

  constructor(lexResult: LexResult) {
    this.lexResult = lexResult;
    this.reader = Reader.new(lexResult.tokens);
    this.diagnostics = DiagnosticBag.new();
  }

  protected or(...parsers: (() => ASTNode)[]) {
    const current = this.reader.pos;

    for (let parser of parsers) {
      try {
        return parser();
      } catch (e: any) {
        this.reader.pos = current;
      }
    }
  }
}
