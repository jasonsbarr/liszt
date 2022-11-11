import * as Types from "./Types";
import * as Constructors from "./constructors";
import * as Validators from "./validators";

module Type {
  // types
  export type Number = Types.NumberType;
  export type Integer = Types.IntegerType;
  export type Float = Types.FloatType;
  export type String = Types.StringType;
  export type Boolean = Types.BooleanType;
  export type Nil = Types.NilType;
  export type Object = Types.ObjectType;
  export type Property = Types.Property;
  export type Function = Types.FunctionType;

  export type Type = Types.Type;

  // constructors
  export const integer = Constructors.integer;
  export const float = Constructors.float;
  export const number = Constructors.number;
  export const string = Constructors.string;
  export const boolean = Constructors.boolean;
  export const nil = Constructors.nil;
  export const object = Constructors.object;
  export const functionType = Constructors.functionType;

  // validators
  export const isNumber = Validators.isNumber;
  export const isInteger = Validators.isInteger;
  export const isFloat = Validators.isFloat;
  export const isString = Validators.isString;
  export const isBoolean = Validators.isBoolean;
  export const isNil = Validators.isNil;
  export const isObject = Validators.isObject;
  export const isFunction = Validators.isFunction;
}

type Type = Type.Type;

export { Type };
