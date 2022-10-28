import { DiagnosticTypes } from "./DiagnosticTypes";
import { TextSpan } from "./TextSpan";

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
