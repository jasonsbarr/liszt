export type Property = {
  name: string;
  type: Type;
};

export abstract class BaseType {
  constructor(public name: string, public types: BaseType[] = []) {}
}

export class NumberType extends BaseType {
  constructor(name: string) {
    super(name);
  }

  public static new(name: string) {
    return new NumberType(name);
  }
}

export class IntegerType extends NumberType {
  constructor() {
    super("Integer");
  }

  public static new() {
    return new IntegerType();
  }
}

export class FloatType extends NumberType {
  constructor() {
    super("Float");
  }

  public static new() {
    return new FloatType();
  }
}

export class StringType extends BaseType {
  constructor() {
    super("String");
  }

  public static new() {
    return new StringType();
  }
}

export class BooleanType extends BaseType {
  constructor() {
    super("Boolean");
  }

  public static new() {
    return new BooleanType();
  }
}

export class NilType extends BaseType {
  constructor() {
    super("Nil");
  }

  public static new() {
    return new NilType();
  }
}

export class ObjectType extends BaseType {
  constructor(public properties: Property[]) {
    super("Object");
  }

  public static new(properties: Property[]) {
    return new ObjectType(properties);
  }
}

export type Type =
  | IntegerType
  | FloatType
  | NumberType
  | StringType
  | BooleanType
  | NilType
  | ObjectType;
