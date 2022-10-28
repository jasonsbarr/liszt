import os from "os";
import { DiagnosticBag } from "../diagnostics/DiagnosticBag";
import { isDigit } from "./helpers";

export class Token {
  constructor(
    public type: TokenTypes,
    public name: TokenNames,
    public value: string,
    public location: SrcLoc,
    public trivia: string = ""
  ) {}

  public static create(
    type: TokenTypes,
    name: TokenNames,
    value: string,
    location: SrcLoc,
    trivia: string = ""
  ) {
    return new Token(type, name, value, location, trivia);
  }
}

export class SrcLoc {
  constructor(public pos: number, public line: number, public col: number) {}

  public static create(pos: number, line: number, col: number) {
    return new SrcLoc(pos, line, col);
  }
}

export class Input {
  public buffer: string;
  public pos: number;
  public line: number;
  public col: number;
  public length: number;

  constructor(buffer: string) {
    this.buffer = buffer;
    this.pos = 0;
    this.line = 1;
    this.col = 1;
    this.length = buffer.length;
  }

  public static create(buffer: string) {
    return new Input(buffer);
  }

  public eof() {
    return this.pos >= this.length;
  }

  public lookahead(chars: number) {
    return this.buffer[this.pos + chars];
  }

  public next() {
    const char = this.buffer[this.pos++];

    if (this.peek() === os.EOL) {
      this.line++;
      this.col = 1;
    } else {
      this.col++;
    }

    return char;
  }

  public peek() {
    return this.buffer[this.pos];
  }

  public readWhile(test: (char: string) => boolean) {
    let result = "";

    while (test(this.peek())) {
      result += this.next();
    }

    return result;
  }
}

export enum TokenTypes {
  Integer,
  Float,
  Operator,
  EOF,
}

export enum TokenNames {
  Integer,
  Float,
  Plus,
  Minus,
  Times,
  Div,
  Mod,
  EOF,
}

export class LexResult {
  constructor(
    public tokens: TokenBag,
    public diagnostics: DiagnosticBag,
    public file: string
  ) {}

  public static create(
    tokens: TokenBag,
    diagnostics: DiagnosticBag,
    file: string
  ) {
    return new LexResult(tokens, diagnostics, file);
  }
}

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

export class Lexer {
  public fileName: string;
  public input: Input;
  public tokens: TokenBag;
  public diagnostics: DiagnosticBag;

  constructor(input: string, fileName: string) {
    this.fileName = fileName;
    this.input = Input.create(input);
    this.tokens = TokenBag.create();
    this.diagnostics = DiagnosticBag.create();
  }

  public static create(input: string, fileName: string = "<stdin>") {
    return new Lexer(input, fileName);
  }

  public readNumber(trivia = "") {
    let digitString = this.input.readWhile(isDigit);

    this.tokens.addIntegerToken(
      digitString,
      this.input.pos,
      this.input.line,
      this.input.col,
      trivia
    );
  }

  public tokenize() {
    while (!this.input.eof()) {
      let char = this.input.peek();
      let trivia = "";

      if (isDigit(char)) {
        this.readNumber(trivia);
      } else {
        throw new Error(
          `Unrecognized character ${char} (${this.input.col}:${this.input.line})`
        );
      }
    }

    return LexResult.create(this.tokens, this.diagnostics, this.fileName);
  }
}

export const tokenize = (input: string, fileName = "<stdin>") => {
  return Lexer.create(input, fileName).tokenize();
};
