import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { isSubtype } from "./isSubtype";
import { synth } from "./synth";
import { Type } from "./Type";

export const check = (ast: ASTNode, t: Type) => {
  const synthType = synth(ast);

  if (isSubtype(synthType, t)) return true;

  throw new Error(`Expected ${t.name}, got ${synthType.name}`);
};
