import { LexResult } from "../lexer/LexResult";
import { ExpressionParser } from "./ExpressionParser";

export abstract class RuleParser extends ExpressionParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }
}
