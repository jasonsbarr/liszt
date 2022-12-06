import { TokenNames } from "./TokenNames";

export const isDigit = (c: string) => /\d/.test(c);

export const isWhitespace = (c: string) => /[ \t]/.test(c);

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

export const isIdStart = (c: string) => /[\p{L}_\$]/u.test(c);

export const isIdChar = (c: string) => /[\p{L}\p{N}_\$]/u.test(c);

export const isKeyword = (str: string) => str in KEYWORDS;

export const isBooleanLiteral = (str: string) => /true|false/.test(str);

export const isNilLiteral = (str: string) => /nil/.test(str);

export const isNanValue = (str: string) => /NaN/.test(str);

export const isInfinity = (str: string) => /Infinity/.test(str);

export const isOpChar = (c: string) => /[=>\+\-\*\/%!\?<|&\^~\.]/.test(c);

export const isColon = (c: string) => /:/.test(c);

export const KEYWORDS = {
  true: TokenNames.True,
  false: TokenNames.False,
  nil: TokenNames.Nil,
  NaN: TokenNames.NaN,
  Infinity: TokenNames.Infinity,
  as: TokenNames.As,
  integer: TokenNames.IntegerKeyword,
  float: TokenNames.FloatKeyword,
  number: TokenNames.NumberKeyword,
  boolean: TokenNames.BooleanKeyword,
  string: TokenNames.StringKeyword,
  symbol: TokenNames.SymbolKeyword,
  any: TokenNames.AnyKeyword,
  never: TokenNames.NeverKeyword,
  unknown: TokenNames.UnknownKeyword,
  vector: TokenNames.VectorKeyword,
  def: TokenNames.Def,
  var: TokenNames.Var,
  const: TokenNames.Const,
  do: TokenNames.Do,
  end: TokenNames.End,
  return: TokenNames.Return,
  type: TokenNames.Type,
  self: TokenNames.Self,
  if: TokenNames.If,
  else: TokenNames.Else,
  vec: TokenNames.Vec,
  for: TokenNames.For,
};

export type kw = keyof typeof KEYWORDS;

export const OPERATORS = {
  "=": TokenNames.Equals,
  "+=": TokenNames.PlusEquals,
  "-=": TokenNames.MinusEquals,
  "*=": TokenNames.TimesEquals,
  "/=": TokenNames.DivEquals,
  "%=": TokenNames.ModEquals,
  "=>": TokenNames.FatArrow,
  "+": TokenNames.Plus,
  "-": TokenNames.Minus,
  "*": TokenNames.Times,
  "/": TokenNames.Div,
  "%": TokenNames.Mod,
  "**": TokenNames.Exp,
  and: TokenNames.And,
  or: TokenNames.Or,
  not: TokenNames.Not,
  "==": TokenNames.DoubleEqual,
  "!=": TokenNames.NotEqual,
  is: TokenNames.Is,
  in: TokenNames.In,
  "<": TokenNames.LT,
  "<=": TokenNames.LTE,
  ">": TokenNames.GT,
  ">=": TokenNames.GTE,
  typeof: TokenNames.TypeOf,
  "&": TokenNames.Amp,
  "|": TokenNames.Pipe,
  ">>": TokenNames.RShift,
  "<<": TokenNames.LShift,
  "^": TokenNames.Xor,
  "~": TokenNames.BNot,
  "...": TokenNames.ThreeDots,
  ".": TokenNames.Dot,
};

export type ops = keyof typeof OPERATORS;

export const PUNC = {
  ":": TokenNames.Colon,
  "(": TokenNames.LParen,
  ")": TokenNames.RParen,
  "{": TokenNames.LBrace,
  "}": TokenNames.RBrace,
  ",": TokenNames.Comma,
  "[": TokenNames.LBracket,
  "]": TokenNames.RBracket,
};

export type punc = keyof typeof PUNC;

export const isOp = (str: string) => Object.keys(OPERATORS).includes(str);

export const isPunc = (c: string) => Object.keys(PUNC).includes(c);

export const isSingleQuote = (c: string) => /'/.test(c);
