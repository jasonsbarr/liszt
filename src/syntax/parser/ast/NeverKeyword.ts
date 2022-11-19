import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { PrimitiveKeyword } from "./PrimitiveKeyword";
import { SyntaxNodes } from "./SyntaxNodes";

export class NeverKeyword extends PrimitiveKeyword {
  constructor(token: Token, start: SrcLoc) {
    super(SyntaxNodes.NeverKeyword, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new NeverKeyword(token, start);
  }
}
