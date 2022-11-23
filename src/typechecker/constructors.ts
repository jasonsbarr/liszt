import { SrcLoc } from "../syntax/lexer/SrcLoc";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { TypeEnv } from "./TypeEnv";
import {
  AnyType,
  BooleanType,
  FloatType,
  FunctionType,
  GenericFunction,
  GenericType,
  IntegerType,
  NeverType,
  NilType,
  NotType,
  NumberType,
  ObjectType,
  Property,
  SingletonType,
  StringType,
  SymbolType,
  Type,
  UNDEFINED,
  UnknownType,
} from "./Types";

export const integer = (constant = false, nullable = false) =>
  IntegerType.new(constant, nullable);

export const float = (constant = false, nullable = false) =>
  FloatType.new(constant, nullable);

export const number = (constant = false, nullable = false) =>
  NumberType.new(constant, nullable);

export const string = (constant = false, nullable = false) =>
  StringType.new(constant, nullable);

export const boolean = (constant = false, nullable = false) =>
  BooleanType.new(constant, nullable);

export const symbol = (constant = false, nullable = false) =>
  SymbolType.new(constant, nullable);

export const nil = () => NilType.new();

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

export const any = () => AnyType.new();

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

export const never = () => NeverType.new();

export const unknown = () => UnknownType.new();

export const not = (base: Type) => NotType.new(base);

export const generic = (variable: string) => GenericType.new(variable);

export const genericFunction = (
  args: Type[],
  ret: Type,
  params: { name: string; type: Type }[],
  body: ASTNode,
  env: TypeEnv
) => GenericFunction.new(args, ret, params, body, env);
