import { TokenBag } from "../lexer/TokenBag";
import { TokenNames } from "../lexer/TokenNames";
import { TokenTypes } from "../lexer/TokenTypes";

export class Reader {
  private _tokens: TokenBag;
  public length: number;
  public pos: number;

  constructor(tokens: TokenBag) {
    this._tokens = tokens;
    this.length = tokens.length;
    this.pos = 0;
  }

  public static new(tokens: TokenBag) {
    return new Reader(tokens);
  }

  public eof() {
    return this.peek().type === TokenTypes.EOF;
  }

  public lookahead(i: number) {
    return this._tokens.get(this.pos + i);
  }

  public next() {
    return this._tokens.get(this.pos++);
  }

  public peek() {
    return this._tokens.get(this.pos);
  }

  public skip(tokenName: TokenNames) {
    const token = this.peek();

    if (token.name !== tokenName) {
      throw new Error(`Expected ${tokenName}, got ${token.name}`);
    }

    this.pos++;
  }
}
