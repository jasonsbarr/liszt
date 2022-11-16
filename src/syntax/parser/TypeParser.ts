import { LexResult } from "../lexer/LexResult";
import { TypeAnnotationParser } from "./TypeAnnotationParser";

/**
 * Holds methods for parsing types and classes
 */
export class TypeParser extends TypeAnnotationParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }
}
