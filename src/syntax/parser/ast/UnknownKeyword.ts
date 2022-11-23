import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { PrimitiveKeyword } from "./PrimitiveKeyword";
import { SyntaxNodes } from "./SyntaxNodes";

export class UnknownKeyword extends PrimitiveKeyword {
  constructor(token: Token, start: SrcLoc) {
    super(SyntaxNodes.UnknownKeyword, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new UnknownKeyword(token, start);
  }
}
