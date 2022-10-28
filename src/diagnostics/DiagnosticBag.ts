import { SrcLoc } from "../lexer/Lexer";

export class DiagnosticBag {
  public diagnostics: Diagnostic[];

  constructor() {
    this.diagnostics = [];
  }

  public static create() {
    return new DiagnosticBag();
  }

  public static fromArray(diagnostics: Diagnostic[]) {
    let db = DiagnosticBag.create();

    for (let diagnostic of diagnostics) {
      db.append(diagnostic);
    }

    return db;
  }

  public static of(other: DiagnosticBag) {
    let db = DiagnosticBag.create();

    for (let diagnostic of other) {
      db.append(diagnostic);
    }

    return db;
  }

  private append(diagnostic: Diagnostic) {
    this.diagnostics.push(diagnostic);

    return this;
  }

  *[Symbol.iterator]() {
    for (let diagnostic of this.diagnostics) {
      yield diagnostic;
    }
  }

  toArray() {
    return ([] as Diagnostic[]).concat(this.diagnostics);
  }
}

export class Diagnostic {
  constructor(
    public type: DiagnosticTypes,
    public message: string,
    public span: TextSpan
  ) {}

  public static create(type: DiagnosticTypes, message: string, span: TextSpan) {
    return new Diagnostic(type, message, span);
  }

  toString() {
    return this.message;
  }
}

export class TextSpan {
  constructor(public text: string, public location: SrcLoc) {}

  public static create(text: string, location: SrcLoc) {
    return new TextSpan(text, location);
  }
}

export enum DiagnosticTypes {
  Error,
  Warning,
}
