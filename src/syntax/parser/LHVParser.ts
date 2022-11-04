import { LexResult } from "../lexer/LexResult";
import { BaseParser } from "./BaseParser";

export abstract class LHVParser extends BaseParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }
}
