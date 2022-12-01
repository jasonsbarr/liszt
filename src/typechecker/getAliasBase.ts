import { Type } from "./Type";

export const getAliasBase = (type: Type.TypeAlias): Type => {
  let t: Type = type.base;
  while ((t as Type.TypeAlias).base) {
    t = (t as Type.TypeAlias).base;
  }

  return t;
};
