import { ASTNode } from "../parser/ast/ASTNode";
import { BoundIntegerLiteral } from "../typechecker/tree/BoundIntegerLiteral";
import { BoundNodes } from "../typechecker/tree/BoundNodes";
import { BoundProgramNode } from "../typechecker/tree/BoundProgramNode";
import { BoundTree } from "../typechecker/tree/BoundTree";

export class Emitter {
  constructor(public tree: SyntaxTree) {}

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
}
