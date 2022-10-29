import { ASTNode } from "../parser/ast/ASTNode";
import { IntegerLiteral } from "../parser/ast/IntegerLiteral";
import { ProgramNode } from "../parser/ast/ProgramNode";
import { SyntaxNodes } from "../parser/ast/SyntaxNodes";
import { SyntaxTree } from "../parser/ast/SyntaxTree";

export class Emitter {
  constructor(public tree: SyntaxTree) {}

  public static new(tree: SyntaxTree) {
    return new Emitter(tree);
  }

  public emit() {
    const program = this.tree.root;

    return this.emitNode(program);
  }

  private emitNode(node: ASTNode) {
    switch (node.kind) {
      case SyntaxNodes.ProgramNode:
        return this.emitProgram(node as ProgramNode);
      case SyntaxNodes.IntegerLiteral:
        return this.emitInteger(node as IntegerLiteral);
      default:
        throw new Error(`Unknown syntax node type ${node.kind}`);
    }
  }

  private emitProgram(node: ProgramNode) {
    const nodes = node.children;
    let code = "";

    for (let node of nodes) {
      code += this.emitNode(node);
    }

    return code;
  }

  private emitInteger(node: IntegerLiteral) {
    return `${node.token.value}n`;
  }
}
