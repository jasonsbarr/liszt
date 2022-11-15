import { Token } from "../../syntax/lexer/Token";
import { Identifier } from "../../syntax/parser/ast/Identifier";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundIdentifier extends BoundASTNode {
  public name: string;
  public token: Token;
  constructor(public type: Type, node: Identifier) {
    super(BoundNodes.BoundIdentifier, node.start, node.end);
    this.name = node.name;
    this.token = node.token;
  }

  public static new(type: Type, node: Identifier) {
    return new BoundIdentifier(type, node);
  }

  public get children() {
    return [];
  }

  public toString() {
    return `BoundIdentifier ${this.name}: ${this.type}`;
  }
}
