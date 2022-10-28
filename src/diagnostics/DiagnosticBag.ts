import { Diagnostic } from "./Diagnostic";

export class DiagnosticBag {
  private _diagnostics: Diagnostic[];

  constructor() {
    this._diagnostics = [];
  }

  public static new() {
    return new DiagnosticBag();
  }

  public static fromArray(diagnostics: Diagnostic[]) {
    let db = DiagnosticBag.new();

    for (let diagnostic of diagnostics) {
      db.append(diagnostic);
    }

    return db;
  }

  public static from(other: DiagnosticBag) {
    let db = DiagnosticBag.new();

    for (let diagnostic of other) {
      db.append(diagnostic);
    }

    return db;
  }

  private append(diagnostic: Diagnostic) {
    this._diagnostics.push(diagnostic);
  }

  public concat(other: DiagnosticBag) {
    let db = DiagnosticBag.from(this);

    for (let diagnostic of other) {
      db.append(diagnostic);
    }

    return db;
  }

  public get diagnostics() {
    return this._diagnostics;
  }

  *[Symbol.iterator]() {
    for (let diagnostic of this._diagnostics) {
      yield diagnostic;
    }
  }

  toArray() {
    return ([] as Diagnostic[]).concat(this._diagnostics);
  }
}
