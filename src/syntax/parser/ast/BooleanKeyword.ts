import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { PrimitiveKeyword } from "./PrimitiveKeyword";
import { SyntaxNodes } from "./SyntaxNodes";

export class BooleanKeyword extends PrimitiveKeyword {
  constructor(token: Token, start: SrcLoc) {
    super(SyntaxNodes.BooleanKeyword, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new BooleanKeyword(token, start);
  }
}
