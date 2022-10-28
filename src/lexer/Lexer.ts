import { DiagnosticBag } from "../diagnostics/DiagnosticBag";
import { isDigit } from "./helpers";
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
