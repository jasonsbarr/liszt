import { AssignmentExpression } from "../syntax/parser/ast/AssignmentExpression";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { Identifier } from "../syntax/parser/ast/Identifier";
import { LambdaExpression } from "../syntax/parser/ast/LambdaExpression";
import { ObjectLiteral } from "../syntax/parser/ast/ObjectLiteral";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { isSubtype } from "./isSubtype";
import { propType } from "./propType";
import { synth } from "./synth";
import { Type } from "./Type";
import { TypeEnv } from "./TypeEnv";

export const check = (ast: ASTNode, t: Type, env: TypeEnv) => {
  if (ast.kind === SyntaxNodes.ObjectLiteral && Type.isObject(t)) {
    return checkObject(ast as ObjectLiteral, t, env);
  }

  if (ast.kind === SyntaxNodes.LambdaExpression && Type.isFunction(t)) {
    return checkFunction(ast as LambdaExpression, t, env);
  }

  if (ast.kind === SyntaxNodes.AssignmentExpression) {
    return checkAssignment(ast as AssignmentExpression, t, env);
  }

  const synthType = synth(ast, env);

  if (isSubtype(synthType, t)) return true;

  throw new Error(`Expected ${t.name}, got ${synthType.name}`);
};

type ObjectProps = {
  name: string;
  expr: ASTNode;
  key: Identifier;
};

const checkObject = (ast: ObjectLiteral, type: Type.Object, env: TypeEnv) => {
  const objProps: ObjectProps[] = ast.properties.map((prop) => {
    if (prop.key.kind !== SyntaxNodes.Identifier) {
      throw new Error(
        `Object property names must be valid identifiers; ${prop.key.kind} given`
      );
    }

    return { name: prop.key.name, expr: prop.value, key: prop.key };
  });

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
    } else {
      throw new Error(`Property ${name} does not exist on type ${type}`);
    }
  });

  return true;
};

const checkFunction = (
  node: LambdaExpression,
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
