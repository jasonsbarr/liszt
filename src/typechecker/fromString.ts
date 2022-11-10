import { tokenize } from "../syntax/lexer/tokenize";
import { TypeAnnotationParser } from "../syntax/parser/TypeAnnotationParser";
import { fromAnnotation } from "./fromAnnotation";

export const fromString = (input: string) => {
  const parser = new TypeAnnotationParser(tokenize(input));
  const annotation = parser.parseTypeAnnotation();
  return fromAnnotation(annotation.type);
};
