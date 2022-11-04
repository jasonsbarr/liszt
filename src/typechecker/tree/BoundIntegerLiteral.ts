import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { IntegerLiteral } from "../../syntax/parser/ast/IntegerLiteral";
import { BoundNodes } from "./BoundNodes";

export class BoundIntegerLiteral extends IntegerLiteral {
  constructor(token: Token, start: SrcLoc) {
    super(token, start);
    this.kind = BoundNodes.BoundIntegerLiteral;
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundIntegerLiteral(token, start);
  }
}
