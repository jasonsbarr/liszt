export class Env<T> {
  private _vars = new Map<string, T>();
  private _children: Array<Env<T>> = [];

  constructor(public name: string, public parent?: Env<T>) {}

  public static new<T>(name: string, parent?: Env<T>) {
    return new Env<T>(name, parent);
  }

  protected get children() {
    return this._children;
  }

  public get vars() {
    return this._vars;
  }

  public get entries() {
    return Array.from(this._vars.entries());
  }

  public get names() {
    return Array.from(this.vars.keys());
  }

  public extend(name: string): Env<T> {
    const env = Env.new(name, this);
    let currentEnv: Env<T> | undefined = this;

    while (currentEnv) {
      currentEnv.children.push(env);
      currentEnv = currentEnv.parent;
    }

    return env;
  }

  public get(name: string) {
    const scope = this.lookup(name);

    if (scope) {
      return scope._vars.get(name);
    }

    throw new Error(`Name ${name} cannot be resolved in the current scope`);
  }

  public getChildEnv(name: string) {
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
