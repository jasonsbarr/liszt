import { DiagnosticBag } from "../diagnostics/DiagnosticBag";
import { LexResult } from "../lexer/LexResult";
import { TokenBag } from "../lexer/TokenBag";
import { ProgramNode } from "./ast/ProgramNode";
import { SyntaxTree } from "./ast/SyntaxTree";

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
    return this.pos >= this.length;
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
}

export abstract class BaseParser {
  protected lexResult: LexResult;
  protected reader: Reader;
  protected diagnostics: DiagnosticBag;

  constructor(lexResult: LexResult) {
    this.lexResult = lexResult;
    this.reader = Reader.new(lexResult.tokens);
    this.diagnostics = DiagnosticBag.new();
  }
}

export class LHVParser extends BaseParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }
}

export class ExpressionParser extends LHVParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  public parseExpression() {}
}

export class RuleParser extends ExpressionParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }
}

export class Parser extends RuleParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  public static new(lexResult: LexResult) {
    return new Parser(lexResult);
  }

  public parse(): SyntaxTree {
    const start = this.lexResult.tokens.get(0).location;
    const end = this.lexResult.tokens.get(
      this.lexResult.tokens.length - 1
    ).location;
    let program = ProgramNode.new(start, end);

    return SyntaxTree.new(program, this.diagnostics, this.lexResult);
  }

  public parseToplevel() {}
}
