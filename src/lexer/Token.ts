import { TokenNames } from "./TokenNames";
import { TokenTypes } from "./TokenTypes";
import { SrcLoc } from "./SrcLoc";

export class Token {
  constructor(
    public type: TokenTypes,
    public name: TokenNames,
    public value: string,
    public location: SrcLoc,
    public trivia: string = ""
  ) {}

  public static create(
    type: TokenTypes,
    name: TokenNames,
    value: string,
    location: SrcLoc,
    trivia: string = ""
  ) {
    return new Token(type, name, value, location, trivia);
  }
}
