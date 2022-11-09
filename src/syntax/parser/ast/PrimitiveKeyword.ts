import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { PrimitiveNode } from "./PrimitiveNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class PrimitiveKeyword extends PrimitiveNode {
  constructor(kind: SyntaxNodes, token: Token, start: SrcLoc) {
    super(kind, token, start);
  }

  toString() {
    return String(this.kind);
  }
}
