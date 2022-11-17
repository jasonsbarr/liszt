import { SrcLoc } from "../syntax/lexer/SrcLoc";
import {
  AnyType,
  BooleanType,
  FloatType,
  FunctionType,
  IntegerType,
  NilType,
  NumberType,
  ObjectType,
  Property,
  SingletonType,
  StringType,
  Type,
  UNDEFINED,
} from "./Types";

export const integer = (constant = false) => IntegerType.new(constant);

export const float = (constant = false) => FloatType.new(constant);

export const number = (constant = false) => NumberType.new(constant);

export const string = (constant = false) => StringType.new(constant);

export const boolean = (constant = false) => BooleanType.new(constant);

export const nil = NilType.new();

export const object = (
  properties: Property[] | { [name: string]: Type },
  constant = false
): ObjectType => {
  if (Array.isArray(properties)) {
    return ObjectType.new(properties, constant);
  } else {
    return object(
      Object.entries(properties).map(([name, type]) => ({ name, type }))
    );
  }
};

export const functionType = (args: Type[], ret: Type) =>
  FunctionType.new(args, ret);

export const any = AnyType.new();

export const singleton = (value: boolean | number | bigint | string) => {
  switch (typeof value) {
    case "boolean":
      return SingletonType.new(BooleanType, value);
    case "string":
      return SingletonType.new(StringType, value);
    case "number":
      if (Number.isInteger(value)) {
        return SingletonType.new(IntegerType, value);
      }
      return SingletonType.new(FloatType, value);
    case "bigint":
      return SingletonType.new(IntegerType, value);
  }
};

export const undefinedType = (location: SrcLoc) => UNDEFINED.new(location);
