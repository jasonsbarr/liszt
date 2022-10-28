import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class PrimitiveNode extends ASTNode {
  public token: Token;

  constructor(type: SyntaxNodes, token: Token, start: SrcLoc) {
    super(type, start);
    this.token = token;
  }

  public get children(): ASTNode[] {
    return [];
  }

  public toString() {
    return `${this.type}: ${this.token}`;
  }
}
