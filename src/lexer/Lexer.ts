import { DiagnosticBag } from "../diagnostics/DiagnosticBag";
import { isComment, isDigit, isNewline, isWhitespace } from "./helpers";
import { Input } from "./Input";
import { LexResult } from "./LexResult";
import { TokenBag } from "./TokenBag";

export class Lexer {
  public fileName: string;
  public input: Input;
  public tokens: TokenBag;
  public diagnostics: DiagnosticBag;

  constructor(input: string, fileName: string) {
    this.fileName = fileName;
    this.input = Input.new(input);
    this.tokens = TokenBag.new();
    this.diagnostics = DiagnosticBag.new();
  }

  public static new(input: string, fileName: string = "<stdin>") {
    return new Lexer(input, fileName);
  }

  private readNumber(trivia = "") {
    let { pos, line, col } = this.input;
    let digitString = this.input.readWhile(isDigit);

    this.tokens.addIntegerToken(digitString, pos, line, col, trivia);
  }

  private readWhitespace() {
    return this.input.readWhile(isWhitespace);
  }

  public tokenize() {
    let trivia = "";

    while (!this.input.eof()) {
      let char = this.input.peek();

      if (isWhitespace(char)) {
        trivia += this.readWhitespace();
      } else if (isNewline(char)) {
        trivia += this.input.readWhile(isNewline);
      } else if (isComment(char)) {
        trivia += this.input.readWhile((c) => !isNewline(c));
      } else if (isDigit(char)) {
        this.readNumber(trivia);
        trivia = "";
      } else {
        throw new Error(
          `Unrecognized character ${char} (${this.input.col}:${this.input.line})`
        );
      }
    }

    this.tokens.addEOFToken(
      this.input.pos,
      this.input.line,
      this.input.col,
      trivia
    );

    return LexResult.new(
      this.tokens,
      this.diagnostics,
      this.fileName,
      this.input.buffer
    );
  }
}
