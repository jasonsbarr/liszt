import { TokenNames } from "./TokenNames";

export const isDigit = (c: string) => /\d/.test(c);

export const isWhitespace = (c: string) => / \t/.test(c);

export const isNewline = (c: string) => /\n|\r/.test(c);

export const isComment = (c: string) => /;/.test(c);

export const isAlphaNumeric = (c: string) => /[0-9a-zA-Z]/.test(c);

export const isDecimalInt = (str: string) => /[0-9_]+/.test(str);

export const isHexInt = (str: string) => /0x[0-9a-fA-F]+/.test(str);

export const isOctInt = (str: string) => /0o[0-7]+/.test(str);

export const isBinInt = (str: string) => /0b[0-1]+/.test(str);

export const isDot = (c: string) => /\./.test(c);

export const isFloat = (str: string) =>
  /[0-9]*\.[0-9]+(e[\+\-][0-9]+)?/.test(str);

export const isDoubleQuote = (c: string) => /"/.test(c);

export const isHexChar = (c: string) => /[0-9a-zA-Z]/.test(c);

export const isIdStart = (c: string) => /\p{L}/u.test(c);

export const isIdChar = (c: string) => /\p{L}/u.test(c);

export const KEYWORDS = {
  true: TokenNames.True,
  false: TokenNames.False,
  nil: TokenNames.Nil,
};

export const isKeyword = (str: string) => str in KEYWORDS;

export const isBooleanLiteral = (str: string) => /true|false/.test(str);

export const isNilLiteral = (str: string) => /nil/.test(str);
