import { AssignmentExpression } from "../syntax/parser/ast/AssignmentExpression";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { Block } from "../syntax/parser/ast/Block";
import { FunctionDeclaration } from "../syntax/parser/ast/FunctionDeclaration";
import { Identifier } from "../syntax/parser/ast/Identifier";
import { IfExpression } from "../syntax/parser/ast/IfExpression";
import { LambdaExpression } from "../syntax/parser/ast/LambdaExpression";
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

  objProps.forEach(({ name, expr }) => {
    const pType = propType(type, name);

    if (pType) {
      check(expr, pType, env);
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
      if (!check(expr, type, env)) return false;
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
