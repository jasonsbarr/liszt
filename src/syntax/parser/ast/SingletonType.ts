import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { PrimitiveKeyword } from "./PrimitiveKeyword";
import { SyntaxNodes } from "./SyntaxNodes";

export class SingletonType extends PrimitiveKeyword {
  constructor(token: Token, start: SrcLoc) {
    super(SyntaxNodes.SingletonType, token, start);
  }

  public static new(token: Token, start: SrcLoc) {
    return new SingletonType(token, start);
  }
}
