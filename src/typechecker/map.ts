import { Type } from "./Type";

const map1 = (t: Type, fn: (t: Type) => Type) =>
  Type.isUnion(t) ? Type.union(...t.types.map(fn)) : fn(t);

const map2 = (t1: Type, t2: Type, fn: (t1: Type, t2: Type) => Type): Type => {
  if (Type.isUnion(t1) || Type.isUnion(t2)) {
    const t1s = Type.isUnion(t1) ? t1.types : [t1];
    const t2s = Type.isUnion(t2) ? t2.types : [t2];
    // const ts = t1s.map((t1) => t2s.map((t2) => fn(t1, t2)));
    const ts = t1s.reduce(
      (types, t1) =>
        t2s.reduce((_, t2) => {
          types.push(fn(t1, t2));
          return types;
        }, [] as Type[]),
      [] as Type[]
    );

    return Type.union(...ts);
  }

  return fn(t1, t2);
};

export const map: ((t: Type, fn: (t: Type) => Type) => Type) &
  ((t1: Type, t2: Type, fn: (t1: Type, t2: Type) => Type) => Type) = (
  ...args: any[]
) => {
  switch (args.length) {
    case 2:
      return map1(args[0], args[1]);
    case 3:
      return map2(args[0], args[1], args[2]);
    default:
      throw new Error(`Unexpected ${args.length} args`);
  }
};
