import { TokenNames } from "../lexer/TokenNames";

class Expression {
  constructor(
    public name: string,
    public nud: TokenNames | null,
    public led: TokenNames | null,
    public ode: TokenNames | null,
    public precedence: number
  ) {}

  public static new(
    name: string,
    nud: TokenNames | null,
    led: TokenNames | null,
    ode: TokenNames | null,
    precedence: number
  ) {
    return new Expression(name, nud, led, ode, precedence);
  }
}
