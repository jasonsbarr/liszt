import { SrcLoc } from "../../lexer/SrcLoc";
import { Token } from "../../lexer/Token";
import { PrimitiveKeyword } from "./PrimitiveKeyword";
import { SyntaxNodes } from "./SyntaxNodes";

type SingletonTypes = "String" | "Integer" | "Float" | "Boolean";

export class SingletonType extends PrimitiveKeyword {
  constructor(public type: SingletonTypes, token: Token, start: SrcLoc) {
    super(SyntaxNodes.SingletonType, token, start);
  }

  public static new(type: SingletonTypes, token: Token, start: SrcLoc) {
    return new SingletonType(type, token, start);
  }
}
