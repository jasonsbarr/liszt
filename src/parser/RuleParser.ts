import { LexResult } from "../lexer/LexResult";
import { ExpressionParser } from "./ExpressionParser";

export class RuleParser extends ExpressionParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }
}
