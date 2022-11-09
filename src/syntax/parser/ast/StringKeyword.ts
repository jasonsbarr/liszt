import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { PrimitiveNode } from "./PrimitiveNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class StringKeyword extends PrimitiveNode {
  constructor(token: Token, start: SrcLoc) {
    super(SyntaxNodes.StringKeyword, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new StringKeyword(token, start);
  }
}
