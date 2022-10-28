import os from "os";

export class Token {
  constructor(
    public type: TokenTypes,
    public name: TokenNames,
    public value: string,
    public trivia: string = "",
    public location: SrcLoc
  ) {}

  public static create(
    type: TokenTypes,
    name: TokenNames,
    value: string,
    trivia: string = "",
    location: SrcLoc
  ) {
    return new Token(type, name, value, trivia, location);
  }
}

export class SrcLoc {
  constructor(
    public pos: number,
    public line: number,
    public col: number,
    public file: string
  ) {}

  public static create(pos: number, line: number, col: number, file: string) {
    return new SrcLoc(pos, line, col, file);
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
}

export enum TokenNames {
  Integer,
  Float,
  Plus,
  Minus,
  Times,
  Div,
  Mod,
}

export class Lexer {
  public fileName: string;
  public input: Input;

  constructor(input: string, fileName: string) {
    this.fileName = fileName;
    this.input = Input.create(input);
  }

  public static create(input: string, fileName: string = "<stdin>") {
    return new Lexer(input, fileName);
  }

  public tokenize() {
    while (!this.input.eof()) {}
  }
}
