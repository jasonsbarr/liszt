import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundPrimitiveNode extends BoundASTNode {
  constructor(kind: BoundNodes, public token: Token, start: SrcLoc) {
    super(
      kind,
      start,
      SrcLoc.new(
        start.pos + token.value.length,
        token.location.line,
        token.location.col + token.value.length
      )
    );
  }
}
