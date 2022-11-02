import { SyntaxTree } from "../parser/ast/SyntaxTree";
import { SyntaxNodes } from "../parser/ast/SyntaxNodes";
import { ASTNode } from "../parser/ast/ASTNode";
import { ProgramNode } from "../parser/ast/ProgramNode";
import { IntegerLiteral } from "../parser/ast/IntegerLiteral";

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

  private checkProgram(node: ProgramNode) {}

  private checkIntegerLiteral(node: IntegerLiteral) {}
}
