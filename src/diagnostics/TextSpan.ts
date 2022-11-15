import { SrcLoc } from "../syntax/lexer/SrcLoc";

export class TextSpan {
  constructor(
    public text: string,
    public file: string,
    public location: SrcLoc
  ) {}

  public static new(text: string, file: string, location: SrcLoc) {
    return new TextSpan(text, file, location);
  }
}
