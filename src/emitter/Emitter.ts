import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { BoundBooleanLiteral } from "../typechecker/tree/BoundBooleanLiteral";
import { BoundFloatLiteral } from "../typechecker/tree/BoundFloatLiteral";
import { BoundIdentifier } from "../typechecker/tree/BoundIdentifier";
import { BoundIntegerLiteral } from "../typechecker/tree/BoundIntegerLiteral";
import { BoundMemberExpression } from "../typechecker/tree/BoundMemberExpression";
import { BoundNilLiteral } from "../typechecker/tree/BoundNilLiteral";
import { BoundNodes } from "../typechecker/tree/BoundNodes";
import { BoundObjectLiteral } from "../typechecker/tree/BoundObjectLiteral";
import { BoundProgramNode } from "../typechecker/tree/BoundProgramNode";
import { BoundStringLiteral } from "../typechecker/tree/BoundStringLiteral";
import { BoundTree } from "../typechecker/tree/BoundTree";

export class Emitter {
  constructor(public tree: BoundTree) {}

  public static new(tree: BoundTree) {
    return new Emitter(tree);
  }

  public emit() {
    const program = this.tree.root;

    return this.emitNode(program);
  }

  private emitNode(node: ASTNode) {
    switch (node.kind) {
      case BoundNodes.BoundProgramNode:
        return this.emitProgram(node as BoundProgramNode);
      case BoundNodes.BoundIntegerLiteral:
        return this.emitInteger(node as BoundIntegerLiteral);
      case BoundNodes.BoundFloatLiteral:
        return this.emitFloat(node as BoundFloatLiteral);
      case BoundNodes.BoundStringLiteral:
        return this.emitString(node as BoundStringLiteral);
      case BoundNodes.BoundBooleanLiteral:
        return this.emitBoolean(node as BoundBooleanLiteral);
      case BoundNodes.BoundNilLiteral:
        return this.emitNil(node as BoundNilLiteral);
      case BoundNodes.BoundIdentifier:
        return this.emitIdentifier(node as BoundIdentifier);
      case BoundNodes.BoundObjectLiteral:
        return this.emitObject(node as BoundObjectLiteral);
      case BoundNodes.BoundMemberExpression:
        return this.emitMemberExpression(node as BoundMemberExpression);
      default:
        throw new Error(`Unknown bound node type ${node.kind}`);
    }
  }

  private emitProgram(node: BoundProgramNode) {
    const nodes = node.children;
    let code = "";

    for (let node of nodes) {
      code += this.emitNode(node);
    }

    return code;
  }

  private emitInteger(node: BoundIntegerLiteral) {
    return `${node.token.value}n`;
  }

  private emitFloat(node: BoundFloatLiteral) {
    return node.token.value;
  }

  private emitString(node: BoundStringLiteral) {
    const value = node.token.value.slice(1, -1);
    return "`" + value + "`";
  }

  private emitBoolean(node: BoundBooleanLiteral) {
    return node.token.value;
  }

  private emitNil(_node: BoundNilLiteral) {
    return "null";
  }

  private emitIdentifier(node: BoundIdentifier) {
    return node.token.value;
  }

  private emitObject(node: BoundObjectLiteral) {
    let code = "({";

    code += node.properties
      .map(({ key, value }) => {
        return `${this.emitIdentifier(key as BoundIdentifier)}: ${this.emitNode(
          value
        )}`;
      })
      .join(", ");

    code += "})";

    return code;
  }

  private emitMemberExpression(node: BoundMemberExpression): string {
    return `${this.emitNode(node.object)}.${this.emitNode(node.property)}`;
  }
}
