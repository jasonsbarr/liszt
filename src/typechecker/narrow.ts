import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { BinaryOperation } from "../syntax/parser/ast/BinaryOperation";
import { Identifier } from "../syntax/parser/ast/Identifier";
import { LogicalOperation } from "../syntax/parser/ast/LogicalOperation";
import { MemberExpression } from "../syntax/parser/ast/MemberExpression";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { UnaryOperation } from "../syntax/parser/ast/UnaryOperation";
import { falsy, isTruthy, isFalsy, truthy } from "../utils/truthiness";
import { isSubtype } from "./isSubtype";
import { propType } from "./propType";
import { synth } from "./synth";
import { Type } from "./Type";
import { TypeEnv } from "./TypeEnv";

const widenNots = (type: Type): Type => {
  switch (type.name) {
    case "Not":
      return Type.unknown();

    case "Union":
      return Type.union(...(type as Type.Union).types.map(widenNots));

    case "Intersection":
      return Type.intersection(
        ...(type as Type.Intersection).types.map(widenNots)
      );

    case "Object":
      return Type.object(
        (type as Type.Object).properties.map(({ name, type }) => ({
          name,
          type: widenNots(type),
        }))
      );

    default:
      return type;
  }
};

export const narrowType = (x: Type, y: Type): Type => {
  if (Type.isUnknown(x)) return widenNots(y);
  if (Type.isUnknown(y)) return x;
  if (Type.isNever(x) || Type.isNever(y)) return Type.never();

  if (Type.isUnion(x)) {
    return Type.union(...(x as Type.Union).types.map((a) => narrowType(a, y)));
  }
  if (Type.isUnion(y)) {
    return Type.union(...(y as Type.Union).types.map((b) => narrowType(x, b)));
  }

  if (Type.isIntersection(x)) {
    return Type.intersection(
      ...(x as Type.Intersection).types.map((a) => narrowType(a, y))
    );
  }
  if (Type.isIntersection(y)) {
    return Type.intersection(
      ...(y as Type.Intersection).types.map((b) => narrowType(x, b))
    );
  }

  if (Type.isNot(y)) {
    if (isSubtype(x, (y as Type.Not).base)) {
      return Type.never();
    } else if (
      Type.isBoolean(x) &&
      Type.isSingleton((y as Type.Not).base) &&
      Type.isBoolean(((y as Type.Not).base as Type.Singleton).base)
    ) {
      return Type.singleton(!((y as Type.Not).base as Type.Singleton).value);
    } else {
      return x;
    }
  }

  if (Type.isSingleton(x) && Type.isSingleton(y)) {
    return (x as Type.Singleton).value === (y as Type.Singleton).value
      ? x
      : Type.never();
  }
  if (Type.isSingleton(x)) {
    return (x as Type.Singleton).base.name === (y as Type).name
      ? x
      : Type.never();
  }
  if (Type.isSingleton(y)) {
    return (y as Type.Singleton).base.name === (x as Type).name
      ? y
      : Type.never();
  }

  if (Type.isObject(x) && Type.isObject(y)) {
    const properties = (x as Type.Object).properties.map(
      ({ name, type: xType }) => {
        const yType = propType(y, name);
        const type = yType ? narrowType(xType, yType) : xType;
        return { name, type };
      }
    );

    if (properties.some(({ type }) => Type.isNever(type))) {
      return Type.never();
    } else {
      return Type.object(properties);
    }
  }

  return Type.intersection(x, y);
};

const narrowPathIdentifier = (
  node: Identifier,
  type: Type,
  env: TypeEnv
): TypeEnv => {
  const ident = env.get(node.name);
  env.set(node.name, narrowType(ident, type));
  return env;
};

const narrowPathMember = (node: MemberExpression, type: Type, env: TypeEnv) => {
  return narrowPath(
    node.object,
    Type.object({ [node.property.name]: type }),
    env
  );
};

const narrowPathUnary = (
  node: UnaryOperation,
  type: Type,
  env: TypeEnv
): TypeEnv => {
  switch (node.operator) {
    case "!":
    case "-":
    case "+":
    case "~":
      return env;

    case "typeof":
      if (Type.isSingleton(type)) {
        switch (typeof type.value) {
          case "boolean":
            return narrowPath(node.expression, Type.boolean(), env);
          case "number":
            if (Number.isInteger(type.value)) {
              return narrowPath(node.expression, Type.integer(), env);
            }
            return narrowPath(node.expression, Type.float(), env);
          case "bigint":
            return narrowPath(node.expression, Type.integer(), env);
          case "string":
            return narrowPath(node.expression, Type.string(), env);
          case "object":
            return narrowPath(node.expression, Type.object({}), env);
          default:
            return env;
        }
      } else if (Type.isNot(type) && Type.isSingleton(type.base)) {
        switch (typeof type.base.value) {
          case "boolean":
            return narrowPath(node.expression, Type.not(Type.boolean()), env);
          case "number":
            if (Number.isInteger(type.base.value)) {
              return narrowPath(node.expression, Type.not(Type.integer()), env);
            }
            return narrowPath(node.expression, Type.not(Type.float()), env);
          case "bigint":
            return narrowPath(node.expression, Type.not(Type.integer()), env);
          case "string":
            return narrowPath(node.expression, Type.not(Type.string()), env);
          case "object":
            return narrowPath(node.expression, Type.not(Type.object({})), env);
          default:
            return env;
        }
      } else {
        return env;
      }

    default:
      throw new Error(`Unimplemented unary operator ${node.operator}`);
  }
};

const narrowPath = (node: ASTNode, type: Type, env: TypeEnv): TypeEnv => {
  switch (node.kind) {
    case SyntaxNodes.Identifier:
      return narrowPathIdentifier(node as Identifier, type, env);
    case SyntaxNodes.MemberExpression:
      return narrowPathMember(node as MemberExpression, type, env);
    case SyntaxNodes.UnaryOperation:
      return narrowPathUnary(node as UnaryOperation, type, env);
    default:
      return env;
  }
};

const narrowUnary = (
  node: UnaryOperation,
  env: TypeEnv,
  assume: boolean
): TypeEnv => {
  switch (node.operator) {
    case "!":
    case "-":
    case "+":
    case "~":
      return narrow(node.expression, env, !assume);
    case "typeof":
      return env;
    default:
      throw new Error(`Unimplemented unary operator ${node.operator}`);
  }
};

const narrowLogical = (
  node: LogicalOperation,
  env: TypeEnv,
  assume: boolean
): TypeEnv => {
  switch (node.operator) {
    case "and":
      if (assume) {
        env = narrow(node.left, env, true);
        return narrow(node.right, env, true);
      } else {
        if (isTruthy(synth(node.left, env))) {
          return narrow(node.right, env, false);
        } else if (isTruthy(synth(node.right, env))) {
          return narrow(node.left, env, false);
        } else {
          return env;
        }
      }

    case "or":
      if (!assume) {
        env = narrow(node.left, env, false);
        return narrow(node.right, env, false);
      } else {
        if (isFalsy(synth(node.left, env))) {
          return narrow(node.right, env, true);
        } else if (isFalsy(synth(node.right, env))) {
          return narrow(node.left, env, true);
        } else {
          return env;
        }
      }

    default:
      throw new Error(`Unimplemented operator ${node.operator}`);
  }
};

const narrowBinary = (node: BinaryOperation, env: TypeEnv, assume: boolean) => {
  const left = synth(node.left, env);
  const right = synth(node.right, env);

  if (
    (node.operator === "==" && assume) ||
    (node.operator === "!=" && !assume)
  ) {
    env = narrowPath(node.left, right, env);
    return narrowPath(node.right, left, env);
  } else if (
    (node.operator === "!=" && assume) ||
    (node.operator === "==" && !assume)
  ) {
    if (Type.isSingleton(right)) {
      env = narrowPath(node.left, Type.not(right), env);
    }
    if (Type.isSingleton(left)) {
      env = narrowPath(node.right, Type.not(left), env);
    }

    return env;
  }

  return env;
};

export const narrow = (node: ASTNode, env: TypeEnv, assume: boolean) => {
  switch (node.kind) {
    case SyntaxNodes.UnaryOperation:
      return narrowUnary(node as UnaryOperation, env, assume);
    case SyntaxNodes.LogicalOperation:
      return narrowLogical(node as LogicalOperation, env, assume);
    case SyntaxNodes.BinaryOperation:
      return narrowBinary(node as BinaryOperation, env, assume);
    default:
      return narrowPath(node, assume ? truthy : falsy, env);
  }
};
