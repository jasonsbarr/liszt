import {
  IntersectionType,
  ObjectType,
  SingletonType,
  Type,
  UnionType,
} from "./Types";
import { propType } from "./propType";
import { isSubtype } from "./isSubtype";
import { unknown, never } from "./constructors";
import {
  isIntersection,
  isNever,
  isObject,
  isSingleton,
  isUnion,
  isUnknown,
} from "./validators";
import { union, distributeUnion } from "./union";

const collapseSupertypes = (ts: Type[]): Type[] => {
  return ts.filter((t1, i1) =>
    ts.every(
      (t2, i2) =>
        i1 === i2 || !isSubtype(t2, t1) || (isSubtype(t1, t2) && i1 < i2)
    )
  );
};

const flatten = (ts: Type[]): Type[] => {
  return ([] as Type[]).concat(
    ...ts.map((t) => (isIntersection(t) ? t.types : t))
  );
};

export const overlaps = (x: Type, y: Type): boolean => {
  if (isNever(x) || isNever(y)) return false;
  if (isUnknown(x) || isUnknown(y)) return true;

  if (isUnion(x)) return (x as UnionType).types.some((x) => overlaps(x, y));
  if (isUnion(y)) return (y as UnionType).types.some((y) => overlaps(x, y));

  if (isIntersection(x))
    return (x as IntersectionType).types.every((x) => overlaps(x, y));
  if (isIntersection(y))
    return (y as IntersectionType).types.every((y) => overlaps(x, y));

  if (isSingleton(x) && isSingleton(y))
    return (x as SingletonType).value === (y as SingletonType).value;
  if (isSingleton(x))
    return (x as SingletonType).base.name === (y as Type).name;
  if (isSingleton(y))
    return (y as SingletonType).base.name === (x as Type).name;

  if (isObject(x) && isObject(y)) {
    return (x as ObjectType).properties.every(({ name, type: xType }) => {
      const yType = propType(y, name);
      if (!yType) return true;
      else return overlaps(xType, yType);
    });
  }

  return (x as Type).name === (y as Type).name;
};

const intersectionNoUnion = (ts: Type[]): Type => {
  if (ts.some((t1, i1) => ts.some((t2, i2) => i1 < i2 && !overlaps(t1, t2))))
    return never();
  ts = collapseSupertypes(ts);

  if (ts.length === 0) return unknown();
  if (ts.length === 1) return ts[0];
  return IntersectionType.new(ts);
};

export const intersection = (...ts: Type[]): Type => {
  ts = flatten(ts);
  ts = distributeUnion(ts).map((ts) => intersectionNoUnion(ts));
  return union(...ts);
};
