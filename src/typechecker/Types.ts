export abstract class BaseType {
  constructor(public name: string, types: BaseType[] = []) {}
}

export class IntegerType extends BaseType {
  constructor() {
    super("Integer");
  }

  public static new() {
    return new IntegerType();
  }
}

export type Type = IntegerType;
