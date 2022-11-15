import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { ASTNode } from "../../syntax/parser/ast/ASTNode";
import { MemberExpression } from "../../syntax/parser/ast/MemberExpression";
import { Type } from "../Type";
import { BoundASTNode } from "./BoundASTNode";
import { BoundIdentifier } from "./BoundIdentifier";
import { BoundNodes } from "./BoundNodes";

export class BoundMemberExpression extends BoundASTNode {
  constructor(
    public type: Type,
    public object: BoundASTNode,
    public property: BoundASTNode,
    node: MemberExpression
  ) {
    super(BoundNodes.BoundMemberExpression, node.start, node.end);
  }

  public static new(
    type: Type,
    object: BoundASTNode,
    property: BoundASTNode,
    node: MemberExpression
  ) {
    return new BoundMemberExpression(type, object, property, node);
  }

  public get children() {
    return [this.object, this.property];
  }
}
