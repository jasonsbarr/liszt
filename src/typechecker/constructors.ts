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
} from "./Types";

export const integer = IntegerType.new();

export const float = FloatType.new();

export const number = NumberType.new("Number");

export const string = StringType.new();

export const boolean = BooleanType.new();

export const nil = NilType.new();

export const object = (
  properties: Property[] | { [name: string]: Type }
): ObjectType => {
  if (Array.isArray(properties)) {
    return ObjectType.new(properties);
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
