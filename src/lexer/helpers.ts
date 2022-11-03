export const isDigit = (c: string) => /\d/.test(c);

export const isWhitespace = (c: string) => / \t/.test(c);

export const isNewline = (c: string) => /\n|\r/.test(c);

export const isComment = (c: string) => /;/.test(c);

export const isAlphaNumeric = (c: string) => /[0-9a-zA-Z]/.test(c);

export const isDecimalDigit = (str: string) => /[0-9_]+/.test(str);

export const isHexDigit = (str: string) => /0x[0-9a-fA-F]+/.test(str);

export const isOctDigit = (str: string) => /0o[0-7]+/.test(str);

export const isBinDigit = (str: string) => /0b[0-1]+/.test(str);
