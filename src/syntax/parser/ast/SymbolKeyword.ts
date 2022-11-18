import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { PrimitiveKeyword } from "./PrimitiveKeyword";
import { SyntaxNodes } from "./SyntaxNodes";

export class SymbolKeyword extends PrimitiveKeyword {
  constructor(token: Token, start: SrcLoc) {
    super(SyntaxNodes.SymbolKeyword, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new SymbolKeyword(token, start);
  }
}
