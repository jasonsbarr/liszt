export abstract class BaseType {
  constructor(public name: string, public types: BaseType[] = []) {}
}

export class IntegerType extends BaseType {
  constructor() {
    super("Integer");
  }

  public static new() {
    return new IntegerType();
  }
}

export class FloatType extends BaseType {
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

export type Type = IntegerType | FloatType | StringType | BooleanType | NilType;
