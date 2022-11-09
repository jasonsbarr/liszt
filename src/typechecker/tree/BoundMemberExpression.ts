import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { MemberExpression } from "../../syntax/parser/ast/MemberExpression";
import { bind } from "../bind";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundNodes } from "./BoundNodes";

export class BoundMemberExpression extends BoundASTNode {
  public object: BoundASTNode;
  public property: BoundASTNode;

  constructor(
    public type: Type,
    node: MemberExpression,
    start: SrcLoc,
    end: SrcLoc
  ) {
    super(BoundNodes.BoundMemberExpression, start, end);
    this.object = bind(node.object);
    this.property = bind(node.property);
  }

  public static new(
    type: Type,
    node: MemberExpression,
    start: SrcLoc,
    end: SrcLoc
  ) {
    return new BoundMemberExpression(type, node, start, end);
  }

  public get children() {
    return [this.object, this.property];
  }

  toString() {
    return "MemberExpression";
  }
}
