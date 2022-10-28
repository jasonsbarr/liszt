import { LexResult } from "../lexer/LexResult";
import { Parser } from "./Parser";

export const parse = (lexResult: LexResult) => Parser.new(lexResult).parse();
