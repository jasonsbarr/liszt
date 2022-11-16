export type Property = {
  name: string;
  type: Type;
  const?: boolean;
};

export abstract class BaseType {
  constructor(public name: string, public constant = false) {}

  public toString() {
    return this.name;
  }
}

export class NumberType extends BaseType {
  constructor(name: string, constant = false) {
    super(name, constant);
  }

  public static new(constant: boolean) {
    return new NumberType("Number", constant);
  }
}

export class IntegerType extends NumberType {
  constructor(constant = false) {
    super("Integer", constant);
  }

  public static new(constant = false) {
    return new IntegerType(constant);
  }
}

export class FloatType extends NumberType {
  constructor(constant = false) {
    super("Float", constant);
  }

  public static new(constant = false) {
    return new FloatType(constant);
  }
}

export class StringType extends BaseType {
  constructor(constant = false) {
    super("String", constant);
  }

  public static new(constant = false) {
    return new StringType(constant);
  }
}

export class BooleanType extends BaseType {
  constructor(constant = false) {
    super("Boolean", constant);
  }

  public static new(constant = false) {
    return new BooleanType(constant);
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
  constructor(public properties: Property[], constant = false) {
    super("Object", constant);
  }

  public static new(properties: Property[], constant = false) {
    return new ObjectType(properties, constant);
  }

  public toString() {
    const properties = this.properties
      .map((prop) => `${prop.name}: ${prop.type}`)
      .join(", ");
    return `{ ${properties} }`;
  }
}

export class FunctionType extends BaseType {
  constructor(public args: Type[], public ret: Type) {
    super("Function", true);
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
  constructor() {
    super("Any", false);
  }

  public static new() {
    return new AnyType();
  }
}

export class SingletonType extends BaseType {
  constructor(
    public base:
      | typeof IntegerType
      | typeof FloatType
      | typeof StringType
      | typeof BooleanType,
    public value: string | number | bigint | boolean
  ) {
    super("Singleton", true);
  }

  public static new(
    base:
      | typeof IntegerType
      | typeof FloatType
      | typeof StringType
      | typeof BooleanType,
    value: string | number | bigint | boolean
  ) {
    return new SingletonType(base, value);
  }

  public toString() {
    return this.base.name === "String" ? `"${this.value}"` : `${this.value}`;
  }
}

export type Type =
  | IntegerType
  | FloatType
  | NumberType
  | NumberType
  | StringType
  | BooleanType
  | NilType
  | ObjectType
  | FunctionType
  | AnyType
  | SingletonType;
