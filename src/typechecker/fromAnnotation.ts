import { TokenNames } from "../syntax/lexer/TokenNames";
import { AnnotatedType } from "../syntax/parser/ast/AnnotatedType";
import { CompoundType } from "../syntax/parser/ast/CompoundType";
import { FunctionType } from "../syntax/parser/ast/FunctionType";
import { Identifier } from "../syntax/parser/ast/Identifier";
import { ObjectPropertyType } from "../syntax/parser/ast/ObjectPropertyType";
import { SingletonType } from "../syntax/parser/ast/SingletonType";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { TupleType } from "../syntax/parser/ast/TupleType";
import { TypeAlias } from "../syntax/parser/ast/TypeAlias";
import { TypeAnnotation } from "../syntax/parser/ast/TypeAnnotation";
import { TypeLiteral } from "../syntax/parser/ast/TypeLiteral";
import { TypeVariable } from "../syntax/parser/ast/TypeVariable";
import { Type } from "./Type";
import { TypeEnv } from "./TypeEnv";
import { VectorType } from "./Types";

export const fromAnnotation = (
  type: TypeAnnotation | TypeAlias | ObjectPropertyType,
  env?: TypeEnv,
  constant = false
): Type => {
  if (type.kind === SyntaxNodes.TypeAlias) {
    if (type instanceof TypeAlias) {
      return Type.typeAlias(type.name.name, fromAnnotation(type.base, env));
    }
  } else if (type instanceof TypeAnnotation) {
    switch (type.type.kind) {
      case SyntaxNodes.IntegerKeyword:
        return Type.integer(constant);
      case SyntaxNodes.FloatKeyword:
        return Type.float(constant);
      case SyntaxNodes.NumberKeyword:
        return Type.number(constant);
      case SyntaxNodes.BooleanKeyword:
        return Type.boolean(constant);
      case SyntaxNodes.StringKeyword:
        return Type.string(constant);
      case SyntaxNodes.SymbolKeyword:
        return Type.symbol(constant);
      case SyntaxNodes.NilLiteral:
        return Type.nil();
      case SyntaxNodes.AnyKeyword:
        return Type.any();
      case SyntaxNodes.NeverKeyword:
        return Type.never();
      case SyntaxNodes.UnknownKeyword:
        return Type.unknown();
      case SyntaxNodes.TypeLiteral:
        return generateObjectType(type.type as TypeLiteral, env, constant);
      case SyntaxNodes.FunctionType:
        return generateFunctionType(type.type as FunctionType, env);
      case SyntaxNodes.SingletonType:
        return generateSingletonType(type.type as SingletonType);
      case SyntaxNodes.UnionType:
        return Type.union(
          ...(type.type as CompoundType).types.map((type) =>
            fromAnnotation(type, env)
          )
        );
      case SyntaxNodes.IntersectionType:
        return Type.intersection(
          ...(type.type as CompoundType).types.map((type) =>
            fromAnnotation(type, env)
          )
        );
      case SyntaxNodes.Identifier:
        return env?.get((type.type as Identifier).name)!; // if undefined, get will throw error
      case SyntaxNodes.TypeVariable:
        return Type.typeVariable((type.type as TypeVariable).name);
      case SyntaxNodes.TupleType:
        return generateTupleType((type.type as TupleType).types, env);
      case SyntaxNodes.VectorType:
        return Type.vector(
          fromAnnotation(
            (type.type as unknown as VectorType)
              .type as unknown as TypeAnnotation,
            env,
            constant
          )
        );
      default:
        throw new Error(`No type definition found for type ${type.type.kind}`);
    }
  } else if (type instanceof ObjectPropertyType) {
    const annotation = TypeAnnotation.new(type.type, type.start, type.end);
    return fromAnnotation(annotation, env, constant);
  }
  throw new Error(
    "This should never happen but I have to make the type checker happy" // it did, in fact, happen
  );
};

const generateObjectType = (
  type: TypeLiteral,
  env?: TypeEnv,
  constant = false
) => {
  const props = type.properties.map(
    (prop) =>
      ({
        name: prop.name,
        type: fromAnnotation(prop, env, constant),
      } as Type.Property)
  );

  return Type.object(props, constant);
};

const generateFunctionType = (type: FunctionType, env?: TypeEnv) => {
  const args = type.parameters.map((p) => {
    return fromAnnotation(p.type, env);
  });
  const ret = fromAnnotation(type.returnType, env);

  return Type.functionType(args, ret);
};

const generateSingletonType = (type: SingletonType) => {
  const token = type.token;
  const value =
    token.name === TokenNames.Integer
      ? BigInt(token.value)
      : token.name === TokenNames.Float
      ? Number(token.value)
      : token.name === TokenNames.True
      ? true
      : token.name === TokenNames.False
      ? false
      : // must be a string value
        token.value;
  return Type.singleton(value);
};

const generateTupleType = (types: TypeAnnotation[], env?: TypeEnv) => {
  const ts = types.map((t) => fromAnnotation(t, env));
  return Type.tuple(ts);
};
