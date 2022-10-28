import { Token } from "../../lexer/Token";
import { ASTNode } from "./ASTNode";
import { SyntaxNodes } from "./SyntaxNodes";

export class PrimitiveNode extends ASTNode {
  public value: Token;

  constructor(type: SyntaxNodes, value: Token) {
    super(type);
    this.value = value;
  }

  public get children(): ASTNode[] {
    return [];
  }

  public toString() {
    return `${this.type}: ${this.value}`;
  }
}
