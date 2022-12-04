import { Identifier } from "../syntax/parser/ast/Identifier";
import { TypeAlias } from "../syntax/parser/ast/TypeAlias";
import { TypeAnnotation } from "../syntax/parser/ast/TypeAnnotation";
import { fromAnnotation } from "./fromAnnotation";
import { TypeEnv } from "./TypeEnv";

export const getType = (
  type: TypeAnnotation | TypeAlias | Identifier,
  env: TypeEnv,
  constant = false
) => {
  if (type instanceof TypeAnnotation) {
    if (type.type instanceof Identifier) {
      const t = env.get(type.type.name);
      return t;
    }

    return fromAnnotation(type, env, constant);
  } else if (type instanceof TypeAlias) {
    const alias = fromAnnotation(type, env, constant);

    if (!env.lookup(type.name.name)) {
      env.set(type.name.name, alias);
    }

    return alias;
  }
  return env.get(type.name);
};
