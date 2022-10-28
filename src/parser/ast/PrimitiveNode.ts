import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class PrimitiveNode extends ASTNode {
  public value: Token;

  constructor(type: SyntaxNodes, value: Token, start: SrcLoc, end: SrcLoc) {
    super(type, start, end);
    this.value = value;
  }

  public get children(): ASTNode[] {
    return [];
  }

  public toString() {
    return `${this.type}: ${this.value}`;
  }
}
