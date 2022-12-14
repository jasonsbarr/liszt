import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class PrimitiveNode extends ASTNode {
  public token: Token;

  constructor(kind: SyntaxNodes, token: Token, start: SrcLoc) {
    super(
      kind,
      start,
      SrcLoc.new(start.pos, start.line, start.col + token.value.length)
    );
    this.token = token;
  }

  public get children(): ASTNode[] {
    return [];
  }

  public toString() {
    return `${this.kind}: ${this.token}`;
  }
}
