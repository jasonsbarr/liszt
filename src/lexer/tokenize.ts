import { Lexer } from "./Lexer";

export const tokenize = (input: string, fileName = "<stdin>") => {
  return Lexer.new(input, fileName).tokenize();
};
