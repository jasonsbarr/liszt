import { LexResult } from "../lexer/LexResult";
import { StatementParser } from "./StatementParser";

/**
 * Holds methods for parsing types and classes
 */
export class TypeParser extends StatementParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }
}
