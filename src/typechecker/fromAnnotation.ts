import { TokenNames } from "../syntax/lexer/TokenNames";
import { FunctionType } from "../syntax/parser/ast/FunctionType";
import { SingletonType } from "../syntax/parser/ast/SingletonType";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { TypeAnnotation } from "../syntax/parser/ast/TypeAnnotation";
import { TypeLiteral } from "../syntax/parser/ast/TypeLiteral";
import { Type } from "./Type";

export const fromAnnotation = (type: TypeAnnotation): Type => {
  switch (type.type.kind) {
    case SyntaxNodes.IntegerKeyword:
      return Type.integer();
    case SyntaxNodes.FloatKeyword:
      return Type.float();
    case SyntaxNodes.NumberKeyword:
      return Type.number();
    case SyntaxNodes.BooleanKeyword:
      return Type.boolean();
    case SyntaxNodes.StringKeyword:
      return Type.string();
    case SyntaxNodes.SymbolKeyword:
      return Type.symbol();
    case SyntaxNodes.NilLiteral:
      return Type.nil();
    case SyntaxNodes.AnyKeyword:
      return Type.any();
    case SyntaxNodes.NeverKeyword:
      return Type.never();
    case SyntaxNodes.TypeLiteral:
      return generateObjectType(type.type as TypeLiteral);
    case SyntaxNodes.FunctionType:
      return generateFunctionType(type.type as FunctionType);
    case SyntaxNodes.SingletonType:
      return generateSingletonType(type.type as SingletonType);
    default:
      throw new Error(`No type definition found for type ${type.type.kind}`);
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

const generateFunctionType = (type: FunctionType) => {
  const args = type.parameters.map((p) => {
    return fromAnnotation(p.type);
  });
  const ret = fromAnnotation(type.returnType);

  return Type.functionType(args, ret);
};

const generateSingletonType = (type: SingletonType) => {
  const token = type.token;
  const value =
    token.name === TokenNames.Integer
      ? BigInt(token.value)
      : TokenNames.Float
      ? Number(token.value)
      : token.name === TokenNames.True
      ? true
      : token.name === TokenNames.False
      ? false
      : // must be a string value
        token.value;
  return Type.singleton(value);
};
