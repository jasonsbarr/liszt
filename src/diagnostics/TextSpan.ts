import { SrcLoc } from "../lexer/SrcLoc";

export class TextSpan {
  constructor(public text: string, public location: SrcLoc) {}

  public static create(text: string, location: SrcLoc) {
    return new TextSpan(text, location);
  }
}
