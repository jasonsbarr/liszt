import { Token } from "../../lexer/Token";
import { SyntaxNodes } from "./SyntaxNodes";
import { PrimitiveNode } from "./PrimitiveNode";
import { SrcLoc } from "../../lexer/SrcLoc";
import { Type } from "../../../typechecker/Type";

export class FloatLiteral extends PrimitiveNode {
  constructor(token: Token, start: SrcLoc) {
    super(SyntaxNodes.FloatLiteral, token, start, Type.float);
  }

  public static new(token: Token, start: SrcLoc) {
    return new FloatLiteral(token, start);
  }
}
