import { Type } from "../typechecker/Type";

export const isTruthy = (type: Type): boolean => {
  switch (type.name) {
    case "Object":
      return true;
    case "Function":
      return true;
    case "Singleton":
      return (type as Type.Singleton).value !== false;
    case "Number":
      return true;
    case "Integer":
      return true;
    case "Float":
      return true;
    case "String":
      return true;
    case "Symbol":
      return true;
    case "Union":
      return (type as Type.Union).types.every(isTruthy);
    case "Intersection":
      return (type as Type.Intersection).types.some(isTruthy);
    default:
      return false;
  }
};

export const isFalsy = (type: Type): boolean => {
  switch (type.name) {
    case "Nil":
      return true;
    case "Singleton":
      return (type as Type.Singleton).value === false;
    case "Union":
      return (type as Type.Union).types.every(isFalsy);
    case "Intersection":
      return (type as Type.Intersection).types.some(isFalsy);
    default:
      return false;
  }
};

export const falsy = Type.union(Type.singleton(false), Type.nil());

export const truth = Type.intersection(
  Type.not(Type.singleton(false)),
  Type.not(Type.nil())
);
