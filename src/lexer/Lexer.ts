class Token {
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

class SrcLoc {
  constructor(public pos: number, public line: number, public col: number) {}

  public static create(pos: number, line: number, col: number) {
    return new SrcLoc(pos, line, col);
  }
}

class Input {
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
    return this.buffer[this.pos++];
  }

  public peek() {
    return this.buffer[this.pos];
  }
}

enum TokenTypes {
  Integer,
  Float,
  Operator,
}

enum TokenNames {
  Integer,
  Float,
  Plus,
  Minus,
  Times,
  Div,
  Mod,
}
