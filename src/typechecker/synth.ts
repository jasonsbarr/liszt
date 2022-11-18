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
import { Block } from "../syntax/parser/ast/Block";
import { VariableDeclaration } from "../syntax/parser/ast/VariableDeclaration";
import { FunctionDeclaration } from "../syntax/parser/ast/FunctionDeclaration";
import { ReturnStatement } from "../syntax/parser/ast/ReturnStatement";
import { BooleanLiteral } from "../syntax/parser/ast/BooleanLiteral";
import { IntegerLiteral } from "../syntax/parser/ast/IntegerLiteral";
import { FloatLiteral } from "../syntax/parser/ast/FloatLiteral";
import { StringLiteral } from "../syntax/parser/ast/StringLiteral";
import { TokenNames } from "../syntax/lexer/TokenNames";
import { BinaryOperation } from "../syntax/parser/ast/BinaryOperation";
import { UnaryOperation } from "../syntax/parser/ast/UnaryOperation";
import { LogicalOperation } from "../syntax/parser/ast/LogicalOperation";
import { isFalsy, isTruthy } from "../utils/truthiness";
import { SymbolLiteral } from "../syntax/parser/ast/SymbolLiteral";

export const synth = (ast: ASTNode, env: TypeEnv, constant = false): Type => {
  switch (ast.kind) {
    case SyntaxNodes.IntegerLiteral:
      return synthInteger(ast as IntegerLiteral, constant);
    case SyntaxNodes.FloatLiteral:
      return synthFloat(ast as FloatLiteral, constant);
    case SyntaxNodes.StringLiteral:
      return synthString(ast as StringLiteral, constant);
    case SyntaxNodes.BooleanLiteral:
      return synthBoolean(ast as BooleanLiteral, constant);
    case SyntaxNodes.SymbolLiteral:
      return synthSymbol(ast as SymbolLiteral);
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
    case SyntaxNodes.Block:
      return synthBlock(ast as Block, env);
    case SyntaxNodes.VariableDeclaration:
      if ((ast as VariableDeclaration).constant) {
        return synthConstantDeclaration(ast as VariableDeclaration, env);
      }
      return synthVariableDeclaration(ast as VariableDeclaration, env);
    case SyntaxNodes.FunctionDeclaration:
      return synthFunctionDeclaration(ast as FunctionDeclaration, env);
    case SyntaxNodes.ReturnStatement:
      return synthReturnStatement(ast as ReturnStatement, env);
    case SyntaxNodes.BinaryOperation:
      return synthBinary(ast as BinaryOperation, env);
    case SyntaxNodes.LogicalOperation:
      return synthLogical(ast as LogicalOperation, env);
    case SyntaxNodes.UnaryOperation:
      return synthUnary(ast as UnaryOperation, env);
    default:
      throw new Error(`Unknown type for expression type ${ast.kind}`);
  }
};

const synthInteger = (node: IntegerLiteral, constant: boolean) => {
  if (constant) {
    return Type.singleton(BigInt(node.token.value));
  }
  return Type.integer(false);
};
const synthFloat = (node: FloatLiteral, constant: boolean) => {
  if (constant) {
    return Type.singleton(Number(node.token.value));
  }
  return Type.float(false);
};
const synthString = (node: StringLiteral, constant: boolean) => {
  if (constant) {
    return Type.singleton(node.token.value);
  }
  return Type.string(false);
};
const synthBoolean = (node: BooleanLiteral, constant: boolean) => {
  if (constant) {
    return Type.singleton(node.token.name === TokenNames.True ? true : false);
  }
  return Type.boolean(false);
};

const synthSymbol = (node: SymbolLiteral) => {
  return Type.symbol();
};

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
    const type = param?.type ? fromAnnotation(param.type) : Type.any;
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

const synthBlock = (node: Block, env: TypeEnv): Type => {
  const returnType = node.expressions.reduce((_: Type, curr: ASTNode) => {
    return synth(curr, env);
  }, Type.any as Type);

  return returnType;
};

const synthVariableDeclaration = (node: VariableDeclaration, env: TypeEnv) => {
  const type = synth(node.assignment.right, env);
  env.set((node.assignment.left as Identifier).name, type);
  return type;
};

const synthConstantDeclaration = (node: VariableDeclaration, env: TypeEnv) => {
  const type = synthSingleton(node, env);
  env.set((node.assignment.left as Identifier).name, type);
  return type;
};

const synthFunctionDeclaration = (node: FunctionDeclaration, env: TypeEnv) => {
  const paramTypes = node.params.map((p) => {
    const name = p.name.name;
    // function declaration params will always have a type annotation
    const type = fromAnnotation(p.type!);

    env.set(name, type);
    return type;
  });

  const returnType = synth(node.body, env);
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

const synthReturnStatement = (node: ReturnStatement, env: TypeEnv) => {
  const val = synth(node.expression, env);
  return val;
};

const synthSingleton = (node: VariableDeclaration, env: TypeEnv) => {
  const value = node.assignment.right;
  switch (value.kind) {
    case SyntaxNodes.IntegerLiteral:
      return synthIntegerLiteral(value as IntegerLiteral, env);
    case SyntaxNodes.FloatLiteral:
      return synthFloatLiteral(value as FloatLiteral, env);
    case SyntaxNodes.BooleanLiteral:
      return synthBooleanLiteral(value as BooleanLiteral, env);
    case SyntaxNodes.StringLiteral:
      return synthStringLiteral(value as StringLiteral, env);
    default:
      return synth(node.assignment.right, env);
  }
};

const synthBooleanLiteral = (node: BooleanLiteral, _env: TypeEnv) => {
  const value = node.token.value;
  return Type.singleton(value === "true" ? true : false);
};

const synthIntegerLiteral = (node: IntegerLiteral, _env: TypeEnv) => {
  return Type.singleton(BigInt(node.token.value));
};

const synthFloatLiteral = (node: FloatLiteral, _env: TypeEnv) => {
  return Type.singleton(Number(node.token.value));
};

const synthStringLiteral = (node: StringLiteral, _env: TypeEnv) => {
  return Type.singleton(node.token.value);
};

const synthBinary = (node: BinaryOperation, env: TypeEnv): Type => {
  const left = synth(node.left, env);
  const right = synth(node.right, env);

  switch (node.operator) {
    case "==":
      if (Type.isSingleton(left) && Type.isSingleton(right)) {
        return Type.singleton(left.value === right.value);
      }
      return Type.boolean();

    case "!=":
      if (Type.isSingleton(left) && Type.isSingleton(right)) {
        return Type.singleton(left.value !== right.value);
      }
      return Type.boolean();

    case "is":
      return Type.boolean();

    case "<":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.boolean();

    case "<=":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.boolean();

    case ">":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.boolean();

    case ">=":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.boolean();

    case "+":
      if (isSubtype(left, Type.number())) {
        if (isSubtype(right, Type.number())) {
          return Type.number();
        } else {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
      } else if (Type.isString(left)) {
        if (Type.isString(right)) {
          return Type.string();
        }
      } else {
        throwOperatorTypeErrorBinary(node.operator, Type.string(), left, right);
      }

      throw new Error(
        `+ only works with 2 strings or 2 numbers; ${left} and ${right} given`
      );

    case "-":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case "*":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case "/":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case "%":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case "**":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case "<":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case "<=":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case ">":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case ">=":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case "&":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case "|":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case ">>":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case "<<":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case "^":
      if (!isSubtype(left, Type.number()) || !isSubtype(right, Type.number())) {
        throwOperatorTypeErrorBinary(node.operator, Type.number(), left, right);
      }
      return Type.number();

    case "in":
      if (!isSubtype(Type.string(), left) || !Type.isObject(right)) {
        throw new Error(
          `Invalid type for in operator: expected string and object, got ${left} and ${right}`
        );
      }
      return Type.boolean();

    default:
      throw new Error(`Unimplemented binary operator ${node.operator}`);
  }
};

const synthLogical = (node: LogicalOperation, env: TypeEnv) => {
  const left = synth(node.left, env);
  const right = synth(node.right, env);

  switch (node.operator) {
    case "and":
      if (isFalsy(left)) return left;
      else if (isTruthy(right)) return right;
      else return Type.boolean();

    case "or":
      if (isTruthy(left)) return left;
      else if (isFalsy(left)) return right;
      else return Type.boolean();

    default:
      throw new Error(`Unimplemented logical operator ${node.operator}`);
  }
};

const synthUnary = (node: UnaryOperation, env: TypeEnv): Type => {
  const expression = synth(node.expression, env);

  switch (node.operator) {
    case "not":
      if (isTruthy(expression)) return Type.singleton(false);
      else if (isFalsy(expression)) return Type.singleton(true);
      else return Type.boolean();

    case "typeof":
      return Type.string();

    case "-":
      if (!isSubtype(Type.number(), expression)) {
        throwOperatorTypeErrorUnary(node.operator, Type.number(), expression);
      }
      return Type.number();

    case "~":
      if (!isSubtype(Type.number(), expression)) {
        throwOperatorTypeErrorUnary(node.operator, Type.number(), expression);
      }
      return Type.number();

    default:
      throw new Error(`Unimplemented unary operator ${node.operator}`);
  }
};

const throwOperatorTypeErrorBinary = (
  operator: string,
  expectedType: Type,
  left: Type,
  right: Type
) => {
  throw new Error(
    `Invalid type for binary operator ${operator}; expected ${expectedType}s, got ${left} and ${right}`
  );
};

const throwOperatorTypeErrorUnary = (
  operator: string,
  expectedType: Type,
  actualType: Type
) => {
  throw new Error(
    `Invalid type for unary operator ${operator}; expected ${expectedType}, got ${actualType}`
  );
};
