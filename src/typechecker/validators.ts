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
} from "./Types";

export const isInteger = (t: Type): t is IntegerType => t.name === "Integer";

export const isFloat = (t: Type): t is FloatType => t.name === "Float";

export const isNumber = (t: Type): t is NumberType =>
  isInteger(t) || isFloat(t);

export const isString = (t: Type): t is StringType => t.name === "String";

export const isBoolean = (t: Type): t is BooleanType => t.name === "Boolean";

export const isNil = (t: Type): t is NilType => t.name === "Nil";

export const isObject = (t: Type): t is ObjectType => t.name === "Object";

export const isFunction = (t: Type): t is FunctionType => t.name === "Function";
