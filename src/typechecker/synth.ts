import { Type } from "./Type";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { ObjectLiteral } from "../syntax/parser/ast/ObjectLiteral";
import { Property } from "./Types";
import { MemberExpression } from "../syntax/parser/ast/MemberExpression";
import { propType } from "./propType";
import { Identifier } from "../syntax/parser/ast/Identifier";
import { AsExpression } from "../syntax/parser/ast/AsExpression";
import { fromAnnotation } from "./fromAnnotation";
import { check } from "./check";
import { LambdaExpression } from "../syntax/parser/ast/LambdaExpression";
import { TypeEnv } from "./TypeEnv";
import { isSubtype } from "./isSubtype";
import { CallExpression } from "../syntax/parser/ast/CallExpression";
import { ParenthesizedExpression } from "../syntax/parser/ast/ParenthesizedExpression";

export const synth = (ast: ASTNode, env: TypeEnv) => {
  switch (ast.kind) {
    case SyntaxNodes.IntegerLiteral:
      return synthInteger();
    case SyntaxNodes.FloatLiteral:
      return synthFloat();
    case SyntaxNodes.StringLiteral:
      return synthString();
    case SyntaxNodes.BooleanLiteral:
      return synthBoolean();
    case SyntaxNodes.NilLiteral:
      return synthNil();
    case SyntaxNodes.ObjectLiteral:
      return synthObject(ast as ObjectLiteral, env);
    case SyntaxNodes.MemberExpression:
      return synthMember(ast as MemberExpression, env);
    case SyntaxNodes.AsExpression:
      return synthAs(ast as AsExpression, env);
    case SyntaxNodes.Identifier:
      return synthIdentifier(ast as Identifier, env);
    case SyntaxNodes.ParenthesizedExpression:
      return synthParenthesizedExpression(ast as ParenthesizedExpression, env);
    case SyntaxNodes.LambdaExpression:
      return synthLambda(ast as LambdaExpression, env);
    case SyntaxNodes.CallExpression:
      return synthCall(ast as CallExpression, env);
    default:
      throw new Error(`Unknown type for expression type ${ast.kind}`);
  }
};

const synthInteger = () => Type.integer;
const synthFloat = () => Type.float;
const synthString = () => Type.string;
const synthBoolean = () => Type.boolean;
const synthNil = () => Type.nil;

const synthObject = (obj: ObjectLiteral, env: TypeEnv) => {
  const props: Property[] = obj.properties.map((prop) => ({
    name: prop.key.name,
    type: synth(prop.value, env),
  }));
  return Type.object(props);
};

const synthMember = (ast: MemberExpression, env: TypeEnv) => {
  const prop = ast.property;

  if (!(prop instanceof Identifier)) {
    throw new Error(
      `Only valid identifiers may be object property names; ${
        (prop as ASTNode).kind
      } given`
    );
  }

  const object = synth(ast.object, env);

  if (!Type.isObject(object)) {
    throw new Error(`MemberExpression expects an object; ${object} given`);
  }

  const type = propType(object, prop.name);

  if (!type) {
    throw new Error(`No such property ${prop.name} on object`);
  }

  return type;
};

const synthAs = (node: AsExpression, env: TypeEnv) => {
  const type = fromAnnotation(node.type);
  check(node.expression, type, env);
  return type;
};

const synthIdentifier = (node: Identifier, env: TypeEnv) => {
  return env.get(node.name)!; // guaranteed not undefined because get method will throw error
};

const synthParenthesizedExpression = (
  node: ParenthesizedExpression,
  env: TypeEnv
): Type => {
  return synth(node.expression, env);
};

const synthLambda = (node: LambdaExpression, env: TypeEnv): Type.Function => {
  const paramTypes = node.params.map((param) => {
    const name = param.name.name;
    if (!param.type) {
      throw new Error(`No type annotation for parameter ${name}`);
    }
    const type = fromAnnotation(param.type);
    // has extended lambdaEnvironment from caller
    env.set(name, type);
    return type;
  });
  const returnType: Type = synth(node.body, env);
  let annotatedType: Type | undefined;

  if (node.ret) {
    annotatedType = fromAnnotation(node.ret);
    if (!isSubtype(returnType, annotatedType)) {
      throw new Error(
        `Return type ${returnType} is not a subtype of annotated type ${annotatedType}`
      );
    }
  }

  return Type.functionType(paramTypes, returnType);
};

const synthCall = (node: CallExpression, env: TypeEnv): Type => {
  const func: Type = synth(node.func, env);

  if (!Type.isFunction(func)) {
    throw new Error(`Call expression expects a function type, got ${func}`);
  }

  if (func.args.length !== node.args.length) {
    throw new Error(
      `Expected ${func.args.length} arguments, got ${node.args.length}`
    );
  }

  func.args.forEach((argType, i) => {
    check(node.args[i], argType, env);
  });

  return func.ret;
};
