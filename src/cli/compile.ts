import { emit } from "../emitter/emit";
import { tokenize } from "../lexer/tokenize";
import { parse } from "../parser/parse";
import { checktypes } from "../typechecker/checktypes";

export const compile = (input: string, file: string = "<stdin>") =>
  emit(checktypes(parse(tokenize(input, file))));
