import {
  Type,
  IntegerType,
  FloatType,
  StringType,
  BooleanType,
  NilType,
  NumberType,
  ObjectType,
  FunctionType,
  AnyType,
  SingletonType,
  UNDEFINED,
  SymbolType,
  NeverType,
  UnionType,
  UnknownType,
  IntersectionType,
  NotType,
  GenericType,
  GenericFunction,
  TypeAlias,
  TupleType,
} from "./Types";

export const isInteger = (t: Type): t is IntegerType => t.name === "Integer";

export const isFloat = (t: Type): t is FloatType => t.name === "Float";

export const isNumber = (t: Type): t is NumberType =>
  isInteger(t) || isFloat(t as Type) || (t as Type).name === "Number";

export const isString = (t: Type): t is StringType => t.name === "String";

export const isBoolean = (t: Type): t is BooleanType => t.name === "Boolean";

export const isSymbol = (t: Type): t is SymbolType => t.name === "Symbol";

export const isNil = (t: Type): t is NilType => t.name === "Nil";

export const isObject = (t: Type): t is ObjectType => t.name === "Object";

export const isFunction = (t: Type): t is FunctionType => t.name === "Function";

export const isAny = (t: Type): t is AnyType => t.name === "Any";

export const isSingleton = (t: Type): t is SingletonType =>
  t.name === "Singleton";

export const isUNDEFINED = (t: Type): t is UNDEFINED => t.name === "UNDEFINED";

export const isNever = (t: Type): t is NeverType => t.name === "Never";

export const isUnion = (t: Type): t is UnionType => t.name === "Union";

export const isUnknown = (t: Type): t is UnknownType => t.name === "Unknown";

export const isIntersection = (t: Type): t is IntersectionType =>
  t.name === "Intersection";

export const isNot = (t: Type): t is NotType => t.name === "Not";

export const isGeneric = (t: Type): t is GenericType => t.name === "Generic";

export const isGenericFunction = (t: Type): t is GenericFunction =>
  t.name === "GenericFunction";

export const isTypeAlias = (t: Type): t is TypeAlias => t instanceof TypeAlias;

export const isTuple = (t: Type): t is TupleType => t.name === "Tuple";
