import { Identifier } from "../syntax/parser/ast/Identifier";
import { TypeAlias } from "../syntax/parser/ast/TypeAlias";
import { TypeAnnotation } from "../syntax/parser/ast/TypeAnnotation";
import { fromAnnotation } from "./fromAnnotation";
import { TypeEnv } from "./TypeEnv";

export const getType = (
  type: TypeAnnotation | TypeAlias | Identifier,
  env: TypeEnv
) => {
  if (type instanceof TypeAnnotation) {
    return fromAnnotation(type);
  } else if (type instanceof TypeAlias) {
    const alias = fromAnnotation(type);

    if (!env.lookup(type.name.name)) {
      env.set(type.name.name, alias);
    }

    return alias;
  }
  return env.get(type.name);
};
