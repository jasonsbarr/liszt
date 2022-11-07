import { Type } from "../../../typechecker/Type";
import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { PrimitiveNode } from "./PrimitiveNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class StringLiteral extends PrimitiveNode {
  constructor(token: Token, start: SrcLoc) {
    super(SyntaxNodes.StringLiteral, token, start, Type.string);
  }

  public static new(token: Token, start: SrcLoc) {
    return new StringLiteral(token, start);
  }
}
