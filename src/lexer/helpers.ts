export const isDigit = (c: string) => /\d/.test(c);

export const isWhitespace = (c: string) => / \t/.test(c);

export const isNewline = (c: string) => /\n|\r/.test(c);

export const isComment = (c: string) => /;/.test(c);
