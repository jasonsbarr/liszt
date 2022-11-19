import { never } from "./constructors";
import { isSubtype } from "./isSubtype";
import { Type, UnionType } from "./Types";
import { isUnion } from "./validators";

const collapseSubtypes = (ts: Type[]): Type[] =>
  ts.filter((t1, i1) =>
    ts.every(
      (t2, i2) =>
        i1 === i2 || !isSubtype(t1, t2) || (isSubtype(t2, t1) && i1 < i2)
    )
  );

const flatten = (ts: Type[]): Type[] =>
  ([] as Type[]).concat(...ts.map((t) => (isUnion(t) ? t.types : t)));

export const union = (...types: Type[]): Type => {
  types = flatten(types);
  types = collapseSubtypes(types);

  if (types.length === 0) return never();
  if (types.length === 1) return types[0];
  return UnionType.new(types);
};
