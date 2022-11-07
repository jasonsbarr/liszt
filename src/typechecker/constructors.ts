import {
  BooleanType,
  FloatType,
  IntegerType,
  NilType,
  ObjectType,
  Property,
  StringType,
  Type,
} from "./Types";

export const integer = IntegerType.new();

export const float = FloatType.new();

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
