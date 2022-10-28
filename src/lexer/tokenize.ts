import { Lexer } from "./Lexer";

export const tokenize = (input: string, fileName = "<stdin>") => {
  return Lexer.create(input, fileName).tokenize();
};
