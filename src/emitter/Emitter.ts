import { ASTNode } from "../parser/ast/ASTNode";
import { BoundBooleanLiteral } from "../typechecker/tree/BoundBooleanLiteral";
import { BoundFloatLiteral } from "../typechecker/tree/BoundFloatLiteral";
import { BoundIntegerLiteral } from "../typechecker/tree/BoundIntegerLiteral";
import { BoundNilLiteral } from "../typechecker/tree/BoundNilLiteral";
import { BoundNodes } from "../typechecker/tree/BoundNodes";
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
      default:
        throw new Error(`Unknown syntax node type ${node.kind}`);
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
    return node.token.value;
  }

  private emitBoolean(node: BoundBooleanLiteral) {
    return node.token.value;
  }

  private emitNil(node: BoundNilLiteral) {
    return "null";
  }
}
