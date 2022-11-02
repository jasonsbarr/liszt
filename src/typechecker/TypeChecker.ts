import { SyntaxTree } from "../parser/ast/SyntaxTree";
import { SyntaxNodes } from "../parser/ast/SyntaxNodes";
import { ASTNode } from "../parser/ast/ASTNode";
import { ProgramNode } from "../parser/ast/ProgramNode";
import { IntegerLiteral } from "../parser/ast/IntegerLiteral";
import { BoundProgramNode } from "./tree/BoundProgramNode";
import { synth } from "./synth";
import { check } from "./check";
import { BoundIntegerLiteral } from "./tree/BoundIntegerLiteral";

export class TypeChecker {
  constructor(public tree: SyntaxTree) {}

  public static new(tree: SyntaxTree) {
    return new TypeChecker(tree);
  }

  public check() {
    const program = this.tree.root;

    return this.checkNode(program);
  }

  private checkNode(node: ASTNode) {
    switch (node.kind) {
      case SyntaxNodes.ProgramNode:
        return this.checkProgram(node as ProgramNode);
      case SyntaxNodes.IntegerLiteral:
        return this.checkIntegerLiteral(node as IntegerLiteral);
      default:
        throw new Error(`Unknown AST node type ${node.kind}`);
    }
  }

  private checkProgram(node: ProgramNode) {
    const nodes = node.children;
    let boundTree = BoundProgramNode.new(node.start, node.end!);

    for (let node of nodes) {
      boundTree.children.push(this.checkNode(node));
    }

    return boundTree;
  }

  private checkIntegerLiteral(node: IntegerLiteral) {
    const synthType = synth(node);
    check(node, synthType);

    return BoundIntegerLiteral.new(node.token, node.start);
  }
}
