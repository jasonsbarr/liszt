import { Type } from "../typechecker/Type";

export class Env<T> {
  private _vars = new Map<string, T>();
  private _children: Array<Env<T>> = [];

  constructor(public name: string, public parent?: Env<T>) {}

  public static new<T>(name: string, parent?: Env<T>) {
    return new Env<T>(name, parent);
  }

  public get children() {
    return this._children;
  }

  public get entries() {
    return Array.from(this._vars.entries());
  }

  public get names() {
    return Array.from(this.vars.keys());
  }

  public get vars() {
    return this._vars;
  }

  public delete(name: string) {
    return this._vars.delete(name);
  }

  public extend(name: string): Env<T> {
    const env = Env.new(name, this);
    this._children.push(env);

    return env;
  }

  public get(name: string) {
    const scope = this.lookup(name);

    if (!scope) {
      throw new Error(`Name ${name} cannot be resolved in the current scope`);
    }

    // Cannot be undefined because above lookup would have failed, resulting in Error
    return scope._vars.get(name)!;
  }

  public getChildEnv(name: string): Env<T> | undefined {
    return this._children.find((child) => name === child.name);
  }

  // looks in current scope ONLY
  public has(name: string) {
    return this._vars.has(name);
  }

  public set(name: string, value: T) {
    this._vars.set(name, value);
  }

  public lookup(name: string) {
    let scope: Env<T> | undefined = this;

    while (scope) {
      if (scope.has(name)) {
        return scope;
      } else {
        scope = scope.parent;
      }
    }
  }
}
