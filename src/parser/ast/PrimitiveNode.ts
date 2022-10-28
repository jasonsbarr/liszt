import { Token } from "../../lexer/Token";
import { ASTNode } from "./ASTNode";

export class PrimitiveNode extends ASTNode {
  public value: Token;

  constructor(type: string, value: Token) {
    super(type);
    this.value = value;
  }

  public get children(): ASTNode[] {
    return [];
  }
}
