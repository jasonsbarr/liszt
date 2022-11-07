import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { PrimitiveNode } from "./PrimitiveNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class Identifier extends PrimitiveNode {
  public name: string;
  constructor(token: Token, start: SrcLoc) {
    super(SyntaxNodes.Identifier, token, start);
    this.name = token.value;
  }

  public static new(token: Token, start: SrcLoc) {
    return new Identifier(token, start);
  }
}
