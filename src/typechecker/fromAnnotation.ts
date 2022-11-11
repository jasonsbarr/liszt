import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { TypeAnnotation } from "../syntax/parser/ast/TypeAnnotation";
import { TypeLiteral } from "../syntax/parser/ast/TypeLiteral";
import { Type } from "./Type";

export const fromAnnotation = (type: TypeAnnotation): Type => {
  switch (type.type.kind) {
    case SyntaxNodes.IntegerKeyword:
      return Type.integer;
    case SyntaxNodes.FloatKeyword:
      return Type.float;
    case SyntaxNodes.NumberKeyword:
      return Type.number;
    case SyntaxNodes.BooleanKeyword:
      return Type.boolean;
    case SyntaxNodes.StringKeyword:
      return Type.string;
    case SyntaxNodes.NilLiteral:
      return Type.nil;
    case SyntaxNodes.TypeLiteral:
      return generateObjectType(type.type as TypeLiteral);
    default:
      throw new Error(`No type definition found for type ${type.kind}`);
  }
};

const generateObjectType = (type: TypeLiteral) => {
  const props = type.properties.map(
    (prop) =>
      ({
        name: prop.name,
        type: fromAnnotation(prop),
      } as Type.Property)
  );

  return Type.object(props);
};
