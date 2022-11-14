import { DiagnosticBag } from "../../diagnostics/DiagnosticBag";
import {
  isAlphaNumeric,
  isBinInt,
  isBooleanLiteral,
  isComment,
  isDecimalInt,
  isDigit,
  isDot,
  isDoubleQuote,
  isFloat,
  isHexChar,
  isHexInt,
  isIdChar,
  isIdStart,
  isInfinity,
  isKeyword,
  isNanValue,
  isNewline,
  isNilLiteral,
  isOctInt,
  isOp,
  isOpChar,
  isPunc,
  isWhitespace,
  KEYWORDS,
  kw,
  OPERATORS,
  ops,
  punc,
  PUNC,
} from "./helpers";
import { Input } from "./Input";
import { LexResult } from "./LexResult";
import { TokenBag } from "./TokenBag";
import { TokenNames } from "./TokenNames";

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

  private readNumber(trivia: string) {
    let { pos, line, col } = this.input;
    let numberString = this.input.readWhile(isAlphaNumeric);

    if (isDot(this.input.peek())) {
      numberString += this.input.next();
      numberString += this.input.readWhile(isDigit);

      if (/e/.test(this.input.peek())) {
        numberString += this.input.next();

        if (/\+|\-/.test(this.input.peek())) {
          numberString += this.input.next();
          numberString += this.input.readWhile(isDigit);
        }
      }
      if (isFloat(numberString)) {
        this.tokens.addFloatToken(numberString, pos, line, col, trivia);
      } else {
        throw new Error(`Invalid number format ${numberString}`);
      }
    } else if (
      isBinInt(numberString) ||
      isHexInt(numberString) ||
      isOctInt(numberString) ||
      isDecimalInt(numberString)
    ) {
      this.tokens.addIntegerToken(numberString, pos, line, col, trivia);
    } else {
      throw new Error(`Invalid number format ${numberString}`);
    }
  }

  private readWhitespace() {
    return this.input.readWhile(isWhitespace);
  }

  private readString(trivia: string) {
    const { pos, line, col } = this.input;
    const value = this.readEscaped();

    this.tokens.addStringToken(value, pos, line, col, trivia);
  }

  private readEscaped() {
    let escaped = false;
    let str = this.input.next(); // get opening quotation mark

    while (!this.input.eof()) {
      let ch = this.input.next();

      if (escaped) {
        str += this.readEscapeSequence(ch);
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (isDoubleQuote(ch)) {
        str += ch;
        break;
      } else if (isNewline(ch)) {
        throw new Error("Unexpected EOL in string literal");
      } else {
        str += ch;
      }
    }

    return str;
  }

  private readEscapeSequence(c: string) {
    let str = "";
    let seq = "";

    if (c === "n") {
      str += "\n";
    } else if (c === "b") {
      str += "\b";
    } else if (c === "f") {
      str += "\f";
    } else if (c === "r") {
      str += "\r";
    } else if (c === "t") {
      str += "\t";
    } else if (c === "v") {
      str += "\v";
    } else if (c === "0") {
      str += "\0";
    } else if (c === "'") {
      str += "'";
    } else if (c === '"') {
      str += '"';
    } else if (c === "\\") {
      str += "\\";
    } else if (c === "u" || c === "U") {
      // is Unicode escape sequence
      seq += this.input.readWhile(isHexChar);
      str += String.fromCodePoint(parseInt(seq, 16));
    }

    return str;
  }

  private readIdentifier(trivia: string) {
    const { pos, line, col } = this.input;
    let value = this.input.next();
    value += this.input.readWhile(isIdChar);

    if (isBooleanLiteral(value)) {
      this.tokens.addBooleanToken(
        KEYWORDS[value as kw], // hack to make sure it knows value is a key in KEYWORDS
        value,
        pos,
        line,
        col,
        trivia
      );
    } else if (isNanValue(value) || isInfinity(value)) {
      this.tokens.addFloatToken(value, pos, line, col, trivia);
    } else if (isNilLiteral(value)) {
      this.tokens.addNilToken(pos, line, col, trivia);
    } else if (isOp(value)) {
      this.tokens.addOperatorToken(
        OPERATORS[value as ops],
        value,
        pos,
        line,
        col,
        trivia
      );
    } else if (isKeyword(value)) {
      this.tokens.addKeywordToken(
        KEYWORDS[value as kw],
        value,
        pos,
        line,
        col,
        trivia
      );
    } else {
      this.tokens.addIdentifierToken(value, pos, line, col, trivia);
    }
  }

  private readOp(trivia: string) {
    const { pos, line, col } = this.input;
    const op = this.input.readWhile(isOpChar);

    if (isOp(op)) {
      this.tokens.addOperatorToken(
        OPERATORS[op as ops],
        op,
        pos,
        line,
        col,
        trivia
      );
    } else {
      throw new Error(`Invalid operator ${op}`);
    }
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
      } else if (isDot(char)) {
        if (isDigit(this.input.lookahead(1))) {
          this.readNumber(trivia);
        } else {
          this.tokens.addPuncToken(
            PUNC[char as punc], // always Dot, obviously
            char,
            this.input.pos,
            this.input.line,
            this.input.col,
            trivia
          );
          this.input.next();
        }
        trivia = "";
      } else if (isDoubleQuote(char)) {
        this.readString(trivia);
        trivia = "";
      } else if (isIdStart(char)) {
        this.readIdentifier(trivia);
        trivia = "";
      } else if (isOpChar(char)) {
        this.readOp(trivia);
      } else if (isPunc(char)) {
        this.tokens.addPuncToken(
          PUNC[char as punc],
          char,
          this.input.pos,
          this.input.line,
          this.input.col,
          trivia
        );
        this.input.next();
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
