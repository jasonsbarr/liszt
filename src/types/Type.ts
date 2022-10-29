import * as Types from "./Types";
import * as Constructors from "./constructors";
import * as Validators from "./validators";

module Type {
  // types
  export type Integer = Types.IntegerType;

  export type Type = Types.Type;

  // constructors
  export const integer = Constructors.integer;

  // validators
  export const isInteger = Validators.isInteger;
}

type Type = Type.Type;

export { Type };
