import { AssignmentExpression } from "../syntax/parser/ast/AssignmentExpression";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { Block } from "../syntax/parser/ast/Block";
import { FunctionDeclaration } from "../syntax/parser/ast/FunctionDeclaration";
import { Identifier } from "../syntax/parser/ast/Identifier";
import { IfExpression } from "../syntax/parser/ast/IfExpression";
import { LambdaExpression } from "../syntax/parser/ast/LambdaExpression";
import { VectorLiteral } from "../syntax/parser/ast/ListLiteral";
import { ObjectLiteral } from "../syntax/parser/ast/ObjectLiteral";
import { ReturnStatement } from "../syntax/parser/ast/ReturnStatement";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { Tuple } from "../syntax/parser/ast/Tuple";
import { VariableDeclaration } from "../syntax/parser/ast/VariableDeclaration";
import { getAliasBase } from "./getAliasBase";
import { isSubtype } from "./isSubtype";
import { narrow } from "./narrow";
import { propType } from "./propType";
import { synth } from "./synth";
import { Type } from "./Type";
import { TypeEnv } from "./TypeEnv";

export const check = (ast: ASTNode, t: Type, env: TypeEnv) => {
  if (Type.isIntersection(t)) {
    (t as Type.Intersection).types.forEach((ty) => check(ast, ty, env));
    // this works because it will error if any check fails
    return true;
  }

  if (Type.isUnion(t)) {
    return checkUnion(ast, t, env);
  }

  if (Type.isSingleton(t)) {
    const synthType = synth(ast, env, true);
    // will only be true if the two have the same value

    if (isSubtype(synthType, t)) return true;

    throw new Error(`Expected ${t as Type}, got ${synthType}`);
  }

  if (ast.kind === SyntaxNodes.ObjectLiteral && Type.isObject(t)) {
    return checkObject(ast as ObjectLiteral, t, env);
  }

  if (ast.kind === SyntaxNodes.LambdaExpression && Type.isFunction(t)) {
    return checkFunction(ast as LambdaExpression, t, env);
  }

  if (ast.kind === SyntaxNodes.AssignmentExpression) {
    return checkAssignment(ast as AssignmentExpression, t, env);
  }

  if (ast.kind === SyntaxNodes.VariableDeclaration) {
    return checkVariableDeclaration(ast as VariableDeclaration, t, env);
  }

  if (
    ast.kind === SyntaxNodes.FunctionDeclaration &&
    (Type.isFunction(t) || Type.isGenericFunction(t))
  ) {
    return checkFunction(ast as FunctionDeclaration, t, env);
  }

  if (ast.kind === SyntaxNodes.Block) {
    return checkBlock(ast as Block, t, env);
  }

  if (ast.kind === SyntaxNodes.ReturnStatement) {
    return checkReturnStatement(ast as ReturnStatement, t, env);
  }

  if (ast.kind === SyntaxNodes.IfExpression) {
    return checkIfExpression(ast as IfExpression, t, env);
  }

  if (ast.kind === SyntaxNodes.Tuple) {
    return checkTuple(ast as Tuple, t, env);
  }

  if (ast.kind === SyntaxNodes.VectorLiteral) {
    return checkVector(ast as VectorLiteral, t, env);
  }

  if (Type.isUNDEFINED(t)) {
    return true;
  }

  if (Type.isAny(t)) {
    return true;
  }

  const synthType = synth(ast, env);

  if (isSubtype(synthType, t)) return true;

  throw new Error(`Expected ${t as Type}, got ${synthType}`);
};

type ObjectProps = {
  name: string;
  expr: ASTNode;
  key: Identifier;
};

const checkObject = (ast: ObjectLiteral, type: Type.Object, env: TypeEnv) => {
  if (Type.isTypeAlias(type)) {
    type = getAliasBase(type) as Type.Object;
  }

  const synthType = synth(ast, env) as Type.Object;
  const objProps: ObjectProps[] = ast.properties.map((prop) => ({
    name: prop.key.name,
    expr: prop.value,
    key: prop.key,
  }));

  type.properties.forEach(({ name }) => {
    const prop = objProps.find(({ name: propName }) => propName === name);

    if (!prop) {
      throw new Error(`Object is missing property ${name}`);
    }
  });

  let typeMap: { [key: string]: Type } = {};

  objProps.forEach(({ name, expr }, i) => {
    let pType = propType(type, name);

    if (pType) {
      // this will be overwritten by the concrete type if it's a type variable
      let resolvedType = pType;
      if (Type.isTypeAlias(pType)) {
        pType = getAliasBase(pType);
      }

      if (Type.isTypeVariable(pType)) {
        if (typeMap[pType.variable]) {
          resolvedType = typeMap[pType.variable];
        } else {
          typeMap[pType.variable] = synthType.properties[i].type;
          resolvedType = typeMap[pType.variable];
        }

        const prop = synthType.properties[i];
        if (!isSubtype(prop.type, resolvedType)) {
          throw new Error(
            `Expected ${resolvedType} or its subtype for property ${prop.name}; got ${prop.type}`
          );
        }
      }

      check(expr, resolvedType, env);
    }
  });

  return true;
};

const checkFunction = (
  node: LambdaExpression | FunctionDeclaration,
  type: Type.Function,
  env: TypeEnv
): boolean => {
  if (type.args.length !== node.params.length) {
    throw new Error(`Expected ${type.args.length}, got ${node.params.length}`);
  }

  node.params.forEach((param, i) => {
    env.set(param.name.name, type.args[i]);
  });

  return check(node.body, type.ret, env);
};

const checkAssignment = (
  node: AssignmentExpression,
  type: Type,
  env: TypeEnv
): boolean => {
  if (node.left instanceof Identifier) {
    // will throw if name is not already defined
    let existsType = env.get(node.left.name)!;
    return check(node.right, existsType, env);
  }

  // right now, it should never get here - will revisit when adding additional LHVs
  // for now, this is just to make TypeScript happy
  return check(node.right, type, env);
};

// This should only matter for declarations with a type annotation
const checkVariableDeclaration = (
  node: VariableDeclaration,
  type: Type,
  env: TypeEnv
): boolean => {
  return check(node.assignment, type, env);
};

// checks return type only
const checkBlock = (node: Block, type: Type, env: TypeEnv): boolean => {
  const exprs = node.expressions;

  for (let expr of exprs) {
    if (expr.kind === SyntaxNodes.ReturnStatement) {
      if (!check(expr, type, env)) {
        throw new Error(
          `Expected ${type} as return type; got ${synth(expr, env)}`
        );
      }
    }
  }
  return check(exprs[exprs.length - 1], type, env);
};

const checkReturnStatement = (
  node: ReturnStatement,
  type: Type,
  env: TypeEnv
): boolean => {
  return check(node.expression, type, env);
};

const checkIfExpression = (
  node: IfExpression,
  type: Type,
  env: TypeEnv
): boolean => {
  // shouldn't need to synth the test because all we're returning is a boolean, not a type
  return (
    check(node.then, type, narrow(node.test, env, true)) &&
    check(node.else, type, narrow(node.test, env, false))
  );
};

const checkTuple = (node: Tuple, type: Type, env: TypeEnv): boolean => {
  if (Type.isTypeAlias(type)) {
    type = getAliasBase(type);
  }

  if (Type.isTuple(type)) {
    return node.values.reduce((valid, v, i) => {
      if (valid) {
        return check(v, (type as Type.Tuple).types[i], env);
      }

      // will never execute because the above check will throw error if it fails
      return valid;
    }, true);
  }

  return check(node, type, env);
};

const checkUnion = (node: ASTNode, type: Type.Union, env: TypeEnv): boolean => {
  for (let t of type.types) {
    try {
      return check(node, t, env);
    } catch (_e: any) {
      // ignore
    }
  }
  // if it gets here, no union arm matched
  throw new Error(`Expected type ${type}; got ${synth(node, env)}`);
};

const checkVector = (
  node: VectorLiteral,
  type: Type,
  env: TypeEnv
): boolean => {
  const baseType = Type.isTypeAlias(type)
    ? (getAliasBase(type) as Type.Vector)
    : (type as Type.Vector);

  return node.members.reduce((_, m) => check(m, baseType.type, env), true);
};
