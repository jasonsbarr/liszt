import { SrcLoc } from "./SrcLoc";
import { Token } from "./Token";
import { TokenNames } from "./TokenNames";
import { TokenTypes } from "./TokenTypes";

export class TokenBag {
  public tokens: Token[];

  constructor() {
    this.tokens = [];
  }

  public static create() {
    return new TokenBag();
  }

  private append(token: Token) {
    this.tokens.push(token);
  }

  public addEOFToken(pos: number, line: number, col: number, trivia: string) {
    const token = Token.create(
      TokenTypes.EOF,
      TokenNames.EOF,
      "EOF",
      SrcLoc.create(pos, line, col),
      trivia
    );

    this.append(token);
  }

  public addIntegerToken(
    value: string,
    pos: number,
    line: number,
    col: number,
    trivia: string
  ) {
    const token = Token.create(
      TokenTypes.Integer,
      TokenNames.Integer,
      value,
      SrcLoc.create(pos, line, col),
      trivia
    );

    this.append(token);
  }
}
