import { SrcLoc } from "../syntax/lexer/SrcLoc";

export type Property = {
  name: string;
  type: Type;
  const?: boolean;
};

export abstract class BaseType {
  constructor(
    public name: string,
    public constant = false,
    public nullable = false
  ) {}

  public toString() {
    return this.name;
  }
}

export class NumberType extends BaseType {
  constructor(name: string, constant = false, nullable = false) {
    super(name, constant, nullable);
  }

  public static new(constant: boolean, nullable = false) {
    return new NumberType("Number", constant, nullable);
  }
}

export class IntegerType extends NumberType {
  constructor(constant = false, nullable = false) {
    super("Integer", constant, nullable);
  }

  public static new(constant = false, nullable = false) {
    return new IntegerType(constant, nullable);
  }
}

export class FloatType extends NumberType {
  constructor(constant = false, nullable = false) {
    super("Float", constant, nullable);
  }

  public static new(constant = false, nullable = false) {
    return new FloatType(constant, nullable);
  }
}

export class StringType extends BaseType {
  constructor(constant = false, nullable = false) {
    super("String", constant, nullable);
  }

  public static new(constant = false, nullable = false) {
    return new StringType(constant, nullable);
  }
}

export class BooleanType extends BaseType {
  constructor(constant = false, nullable = false) {
    super("Boolean", constant, nullable);
  }

  public static new(constant = false, nullable = false) {
    return new BooleanType(constant, nullable);
  }
}

export class SymbolType extends BaseType {
  constructor(constant = false, nullable = false) {
    super("Symbol", constant, nullable);
  }

  public static new(constant = false, nullable = false) {
    return new SymbolType(constant, nullable);
  }
}

export class NilType extends BaseType {
  constructor() {
    super("Nil", true);
  }

  public static new() {
    return new NilType();
  }
}

export class ObjectType extends BaseType {
  constructor(
    public properties: Property[],
    constant = false,
    nullable = false
  ) {
    super("Object", constant, nullable);
  }

  public static new(
    properties: Property[],
    constant = false,
    nullable = false
  ) {
    return new ObjectType(properties, constant, nullable);
  }

  public toString() {
    const properties = this.properties
      .map((prop) => `${prop.name}: ${prop.type}`)
      .join(", ");
    return `{ ${properties + this.nullable ? "?" : ""} }`;
  }
}

export class FunctionType extends BaseType {
  constructor(public args: Type[], public ret: Type) {
    super("Function", true, false);
  }

  public static new(args: Type[], ret: Type) {
    return new FunctionType(args, ret);
  }

  public toString(): string {
    return `(${this.args.map((arg) => arg.toString()).join(", ")}) => ${
      this.ret
    }`;
  }
}

export class AnyType extends BaseType {
  constructor(nullable = false) {
    super("Any", false, nullable);
  }

  public static new(nullable = false) {
    return new AnyType(nullable);
  }
}

export class SingletonType extends BaseType {
  public base: IntegerType | FloatType | BooleanType | StringType;
  constructor(
    base:
      | typeof IntegerType
      | typeof FloatType
      | typeof BooleanType
      | typeof StringType,
    public value: string | number | bigint | boolean
  ) {
    super("Singleton", true, false);
    this.base = base as unknown as
      | IntegerType
      | FloatType
      | BooleanType
      | StringType;
  }

  public static new(
    base:
      | typeof IntegerType
      | typeof FloatType
      | typeof BooleanType
      | typeof StringType,
    value: string | number | bigint | boolean
  ) {
    return new SingletonType(base, value);
  }

  public toString() {
    return this.base.name === "String" ? `"${this.value}"` : `${this.value}`;
  }
}

export class UNDEFINED extends BaseType {
  constructor(public location: SrcLoc) {
    super("UNDEFINED", false, false);
  }

  public static new(location: SrcLoc) {
    return new UNDEFINED(location);
  }
}

export class NeverType extends BaseType {
  constructor() {
    super("Never", true, false);
  }

  public static new() {
    return new NeverType();
  }
}

export class UnionType extends BaseType {
  constructor(public types: Type[], constant = false, nullable = false) {
    super("Union", constant, nullable);
  }

  public static new(types: Type[], constant = false, nullable = false) {
    return new UnionType(types, constant, nullable);
  }
}

export class UnknownType extends BaseType {
  constructor(constant = false, nullable = false) {
    super("Unknown", constant, nullable);
  }

  public static new(constant = false, nullable = false) {
    return new UnknownType(constant, nullable);
  }
}

export class IntersectionType extends BaseType {
  constructor(public types: Type[], constant = false, nullable = false) {
    super("Intersection", constant, nullable);
  }

  public static new(types: Type[], constant = false, nullable = false) {
    return new IntersectionType(types, constant, nullable);
  }
}

export class NotType extends BaseType {
  constructor(public base: Type, constant = false, nullable = false) {
    super("Not", constant, nullable);
  }

  public static new(base: Type, constant = false, nullable = false) {
    return new NotType(base, constant, nullable);
  }

  public toString() {
    return `!${this.base}`;
  }
}

export class GenericType extends BaseType {
  constructor(constant = false, nullable = false) {
    super("Generic", constant, nullable);
  }

  public static new(constant = false, nullable = false) {
    return new GenericType(constant, nullable);
  }
}

export type Type =
  | IntegerType
  | FloatType
  | NumberType
  | NumberType
  | StringType
  | BooleanType
  | SymbolType
  | NilType
  | ObjectType
  | FunctionType
  | AnyType
  | SingletonType
  | UNDEFINED
  | NeverType
  | UnknownType
  | IntersectionType
  | NotType
  | GenericType;
