import {
  Type,
  IntegerType,
  FloatType,
  StringType,
  BooleanType,
  NilType,
} from "./Types";

export const isInteger = (t: Type): t is IntegerType => t.name === "Integer";

export const isFloat = (t: Type): t is FloatType => t.name === "Float";

export const isString = (t: Type): t is StringType => t.name === "String";

export const isBoolean = (t: Type): t is BooleanType => t.name === "Boolean";

export const isNil = (t: Type): t is NilType => t.name === "Nil";
