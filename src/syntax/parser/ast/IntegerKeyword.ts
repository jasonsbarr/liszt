import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { PrimitiveNode } from "./PrimitiveNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class IntegerKeyword extends PrimitiveNode {
  constructor(token: Token, start: SrcLoc) {
    super(SyntaxNodes.IntegerKeyword, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new IntegerKeyword(token, start);
  }
}
