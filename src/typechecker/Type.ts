import * as Types from "./Types";
import * as Constructors from "./constructors";
import * as Validators from "./validators";
import { union as u, distributeUnion as dU } from "./union";
import { intersection as i } from "./intersection";

module Type {
  // types
  export type Number = Types.NumberType;
  export type Integer = Types.IntegerType;
  export type Float = Types.FloatType;
  export type String = Types.StringType;
  export type Boolean = Types.BooleanType;
  export type Symbol = Types.SymbolType;
  export type Nil = Types.NilType;
  export type Object = Types.ObjectType;
  export type Property = Types.Property;
  export type Function = Types.FunctionType;
  export type Any = Types.AnyType;
  export type Singleton = Types.SingletonType;
  export type UNDEFINED = Types.UNDEFINED;
  export type Never = Types.NeverType;
  export type Union = Types.UnionType;
  export type Unknown = Types.UnknownType;
  export type Intersection = Types.IntersectionType;
  export type Not = Types.NotType;
  export type TypeVariable = Types.TypeVariable;
  export type GenericFunction = Types.GenericFunction;
  export type TypeAlias = Types.TypeAlias;
  export type Tuple = Types.TupleType;

  export type Type = Types.Type;

  // constructors
  export const integer = Constructors.integer;
  export const float = Constructors.float;
  export const number = Constructors.number;
  export const string = Constructors.string;
  export const boolean = Constructors.boolean;
  export const symbol = Constructors.symbol;
  export const nil = Constructors.nil;
  export const object = Constructors.object;
  export const functionType = Constructors.functionType;
  export const any = Constructors.any;
  export const singleton = Constructors.singleton;
  export const undefinedType = Constructors.undefinedType;
  export const never = Constructors.never;
  export const union = u;
  export const unknown = Constructors.unknown;
  export const intersection = i;
  export const not = Constructors.not;
  export const typeVariable = Constructors.typeVariable;
  export const genericFunction = Constructors.genericFunction;
  export const typeAlias = Constructors.typeAlias;
  export const tuple = Constructors.tuple;

  // validators
  export const isNumber = Validators.isNumber;
  export const isInteger = Validators.isInteger;
  export const isFloat = Validators.isFloat;
  export const isString = Validators.isString;
  export const isBoolean = Validators.isBoolean;
  export const isSymbol = Validators.isSymbol;
  export const isNil = Validators.isNil;
  export const isObject = Validators.isObject;
  export const isFunction = Validators.isFunction;
  export const isAny = Validators.isAny;
  export const isSingleton = Validators.isSingleton;
  export const isUNDEFINED = Validators.isUNDEFINED;
  export const isNever = Validators.isNever;
  export const isUnion = Validators.isUnion;
  export const isUnknown = Validators.isUnknown;
  export const isIntersection = Validators.isIntersection;
  export const isNot = Validators.isNot;
  export const isTypeVariable = Validators.isTypeVariable;
  export const isGenericFunction = Validators.isGenericFunction;
  export const isTypeAlias = Validators.isTypeAlias;
  export const isTuple = Validators.isTuple;

  export const distributeUnion = dU;
}

type Type = Type.Type;

export { Type };
