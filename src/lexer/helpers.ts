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
