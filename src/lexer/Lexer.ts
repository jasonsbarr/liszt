class Token {
  constructor(
    public type: number,
    public name: number,
    public value: string,
    public trivia: string = "",
    public location: SrcLoc
  ) {}

  public static create(
    type: number,
    name: number,
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

enum TokenTypes {
  Integer,
  Float,
  Operator,
  Whitespace,
  Comment,
}

enum TokenNames {
  Integer,
  Float,
  Plus,
  Minus,
  Times,
  Div,
  Mod,
  WS,
  NL,
  Comment,
}
