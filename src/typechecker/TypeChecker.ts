import { SyntaxTree } from "../parser/ast/SyntaxTree";

export class TypeChecker {
  constructor(public tree: SyntaxTree) {}

  public static new(tree: SyntaxTree) {
    return new TypeChecker(tree);
  }
}
