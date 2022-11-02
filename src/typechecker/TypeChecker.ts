import { SyntaxTree } from "../parser/ast/SyntaxTree";
import { SyntaxNodes } from "../parser/ast/SyntaxNodes";
import { ASTNode } from "../parser/ast/ASTNode";

export class TypeChecker {
  constructor(public tree: SyntaxTree) {}

  public static new(tree: SyntaxTree) {
    return new TypeChecker(tree);
  }

  public check() {
    const program = this.tree.root;

    return this.checkNode(program);
  }

  private checkNode(node: ASTNode) {}
}
