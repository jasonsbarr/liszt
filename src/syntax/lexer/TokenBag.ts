import { SrcLoc } from "./SrcLoc";
import { Token } from "./Token";
import { TokenNames } from "./TokenNames";
import { TokenTypes } from "./TokenTypes";

export class TokenBag {
  private _tokens: Token[];

  constructor() {
    this._tokens = [];
  }

  public static new() {
    return new TokenBag();
  }

  public get length() {
    return this._tokens.length;
  }

  public get tokens() {
    return this._tokens;
  }

  private append(token: Token) {
    this._tokens.push(token);
  }

  public addBooleanToken(
    name: TokenNames,
    value: string,
    pos: number,
    line: number,
    col: number,
    trivia: string
  ) {
    this.append(
      Token.new(
        TokenTypes.Boolean,
        name,
        value,
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public addEOFToken(pos: number, line: number, col: number, trivia: string) {
    this.append(
      Token.new(
        TokenTypes.EOF,
        TokenNames.EOF,
        "EOF",
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public addFloatToken(
    value: string,
    pos: number,
    line: number,
    col: number,
    trivia: string
  ) {
    this.append(
      Token.new(
        TokenTypes.Float,
        TokenNames.Float,
        value,
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public addIdentifierToken(
    value: string,
    pos: number,
    line: number,
    col: number,
    trivia: string
  ) {
    this.append(
      Token.new(
        TokenTypes.Identifier,
        TokenNames.Identifier,
        value,
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public addIntegerToken(
    value: string,
    pos: number,
    line: number,
    col: number,
    trivia: string
  ) {
    this.append(
      Token.new(
        TokenTypes.Integer,
        TokenNames.Integer,
        value,
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public addKeywordToken(
    name: TokenNames,
    value: string,
    pos: number,
    line: number,
    col: number,
    trivia: string
  ) {
    this.append(
      Token.new(
        TokenTypes.Keyword,
        name,
        value,
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public addNilToken(pos: number, line: number, col: number, trivia: string) {
    this.append(
      Token.new(
        TokenTypes.Nil,
        TokenNames.Nil,
        "nil",
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public addOperatorToken(
    name: TokenNames,
    value: string,
    pos: number,
    line: number,
    col: number,
    trivia: string
  ) {
    this.append(
      Token.new(
        TokenTypes.Operator,
        name,
        value,
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public addPuncToken(
    name: TokenNames,
    value: string,
    pos: number,
    line: number,
    col: number,
    trivia: string
  ) {
    this.append(
      Token.new(
        TokenTypes.Punctuation,
        name,
        value,
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public addStringToken(
    value: string,
    pos: number,
    line: number,
    col: number,
    trivia: string
  ) {
    this.append(
      Token.new(
        TokenTypes.String,
        TokenNames.String,
        value,
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public addSymbolToken(
    value: string,
    pos: number,
    line: number,
    col: number,
    trivia: string
  ) {
    this.append(
      Token.new(
        TokenTypes.Symbol,
        TokenNames.Symbol,
        value,
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public addTypeVariableToken(
    value: string,
    pos: number,
    line: number,
    col: number,
    trivia: string
  ) {
    this.append(
      Token.new(
        TokenTypes.TypeVariable,
        TokenNames.TypeVariable,
        value,
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public get(i: number) {
    return this._tokens[i];
  }
}
