import { Diagnostic } from "./Diagnostic";

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

  public static from(other: DiagnosticBag) {
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
