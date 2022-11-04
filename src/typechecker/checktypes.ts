import { TypeChecker } from "./TypeChecker";
import { SyntaxTree } from "../syntax/parser/ast/SyntaxTree";

export const checktypes = (tree: SyntaxTree) => {
  const checker = TypeChecker.new(tree);

  return checker.check();
};
