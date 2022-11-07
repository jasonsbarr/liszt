import { Type } from "../../../typechecker/Type";
import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { PrimitiveNode } from "./PrimitiveNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class NilLiteral extends PrimitiveNode {
  constructor(token: Token, start: SrcLoc) {
    super(SyntaxNodes.NilLiteral, token, start, Type.nil);
  }

  public static new(token: Token, start: SrcLoc) {
    return new NilLiteral(token, start);
  }
}
