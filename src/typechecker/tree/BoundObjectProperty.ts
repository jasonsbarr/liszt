import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { ASTNode } from "../../syntax/parser/ast/ASTNode";
import { ObjectProperty } from "../../syntax/parser/ast/ObjectProperty";
import { Type } from "../Type";

export class BoundObjectProperty extends ObjectProperty {
  constructor(
    key: ASTNode,
    value: ASTNode,
    start: SrcLoc,
    end: SrcLoc,
    public type: Type
  ) {
    super(key, value, start, end);
  }

  public toString() {
    return "BoundObjectProperty";
  }
}
