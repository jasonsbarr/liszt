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
import { falsy, isFalsy, isTruthy, truthy } from "../utils/truthiness";
import { SymbolLiteral } from "../syntax/parser/ast/SymbolLiteral";
import { map } from "./map";
import { IfExpression } from "../syntax/parser/ast/IfExpression";
import { narrow, narrowType } from "./narrow";
import { getType } from "./getType";
import { getAliasBase } from "./getAliasBase";
import { Tuple } from "../syntax/parser/ast/Tuple";
import { VectorLiteral } from "../syntax/parser/ast/ListLiteral";
import { SliceExpression } from "../syntax/parser/ast/SliceExpression";
import { AssignmentExpression } from "../syntax/parser/ast/AssignmentExpression";
import { ForStatement } from "../syntax/parser/ast/ForStatement";

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
      return synthSymbol(ast as SymbolLiteral, constant);
    case SyntaxNodes.NilLiteral:
      return synthNil();
    case SyntaxNodes.ObjectLiteral:
      return synthObject(ast as ObjectLiteral, env, constant);
    case SyntaxNodes.MemberExpression:
      return synthMember(ast as MemberExpression, env);
    case SyntaxNodes.AsExpression:
      return synthAs(ast as AsExpression, env);
    case SyntaxNodes.Identifier:
      return synthIdentifier(ast as Identifier, env);
    case SyntaxNodes.ParenthesizedExpression:
      return synthParenthesizedExpression(ast as ParenthesizedExpression, env);
    case SyntaxNodes.LambdaExpression:
      return synthFunction(ast as LambdaExpression, env);
    case SyntaxNodes.CallExpression:
      return synthCall(ast as CallExpression, env);
    case SyntaxNodes.Block:
      return synthBlock(ast as Block, env);
    case SyntaxNodes.VariableDeclaration:
      if ((ast as VariableDeclaration).constant) {
        return synthConstantDeclaration(ast as VariableDeclaration, env);
      }
      return synthVariableDeclaration(ast as VariableDeclaration, env);
    case SyntaxNodes.AssignmentExpression:
      return synthAssignmentExpression(ast as AssignmentExpression, env);
    case SyntaxNodes.FunctionDeclaration:
      return synthFunction(ast as FunctionDeclaration, env);
    case SyntaxNodes.ReturnStatement:
      return synthReturnStatement(ast as ReturnStatement, env);
    case SyntaxNodes.BinaryOperation:
      return synthBinary(ast as BinaryOperation, env);
    case SyntaxNodes.LogicalOperation:
      return synthLogical(ast as LogicalOperation, env);
    case SyntaxNodes.UnaryOperation:
      return synthUnary(ast as UnaryOperation, env);
    case SyntaxNodes.IfExpression:
      return synthIfExpression(ast as IfExpression, env);
    case SyntaxNodes.Tuple:
      return synthTuple(ast as Tuple, env);
    case SyntaxNodes.VectorLiteral:
      return synthVector(ast as VectorLiteral, env, constant);
    case SyntaxNodes.SliceExpression:
      return synthSlice(ast as SliceExpression, env);
    case SyntaxNodes.ForStatement:
      return synthStatement(ast as ForStatement, env);
    default:
      throw new Error(`Unknown type for expression type ${ast.kind}`);
  }
};

const synthInteger = (node: IntegerLiteral, constant: boolean) => {
  if (constant) {
    return Type.singleton(BigInt(node.token.value));
  }
  return Type.integer(constant);
};
const synthFloat = (node: FloatLiteral, constant: boolean) => {
  if (constant) {
    return Type.singleton(Number(node.token.value));
  }
  return Type.float(constant);
};
const synthString = (node: StringLiteral, constant: boolean) => {
  if (constant) {
    return Type.singleton(node.token.value);
  }
  return Type.string(constant);
};
const synthBoolean = (node: BooleanLiteral, constant: boolean) => {
  if (constant) {
    return Type.singleton(node.token.name === TokenNames.True ? true : false);
  }
  return Type.boolean(constant);
};

const synthSymbol = (node: SymbolLiteral, constant: boolean) => {
  return Type.symbol(constant);
};

const synthNil = () => Type.nil();

const synthObject = (obj: ObjectLiteral, env: TypeEnv, constant = false) => {
  const props: Property[] = obj.properties.map((prop) => ({
    name: prop.key.name,
    type: synth(prop.value, env, constant),
  }));
  return Type.object(props, constant);
};

const synthMember = (ast: MemberExpression, env: TypeEnv) => {
  const prop = ast.property;
  let object = synth(ast.object, env);

  return map(object, (obj) => {
    if (Type.isTypeAlias(obj)) {
      obj = getAliasBase(obj);
    }

    if (!Type.isObject(obj)) {
      throw new Error(`MemberExpression expects an object; ${obj} given`);
    }

    let type = propType(obj, prop.name);

    if (!type) {
      throw new Error(`No such property ${prop.name} on object`);
    }

    if (Type.isTypeAlias(type)) {
      type = getAliasBase(type);
    }

    return type;
  });
};

const synthAs = (node: AsExpression, env: TypeEnv) => {
  const type = getType(node.type, env);
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

const synthFunction = (
  node: LambdaExpression | FunctionDeclaration,
  env: TypeEnv
) => {
  let generic = false;
  const paramTypes = node.params.map((param) => {
    const name = param.name.name;
    const type = param?.type ? getType(param.type, env) : Type.any();

    if (Type.isTypeVariable(type)) {
      generic = true;
    }

    return { name, type };
  });
  const params = paramTypes.map(({ type }) => type);
  const paramLists = Type.distributeUnion(params);
  const funcTypes: (Type.Function | Type.GenericFunction)[] = paramLists.map(
    (args) => {
      paramTypes.forEach((pType, i) => {
        // has extended lambdaEnvironment from caller
        env.set(pType.name, args[i]);
      });
      const returnType: Type = synth(node.body, env);
      let annotatedType: Type | undefined;

      if (node.ret) {
        annotatedType = getType(node.ret, env);
        if (!isSubtype(returnType, annotatedType)) {
          throw new Error(
            `Return type ${returnType} is not a subtype of annotated type ${annotatedType}`
          );
        }
      }

      if (generic) {
        return Type.genericFunction(
          params,
          returnType,
          paramTypes,
          node.body,
          env
        );
      }

      return Type.functionType(args, returnType);
    }
  );
  return Type.intersection(...funcTypes);
};

const synthCall = (node: CallExpression, env: TypeEnv): Type => {
  let func: Type = synth(node.func, env);

  if (Type.isTypeAlias(func)) {
    func = getAliasBase(func);
  }

  return map(func, (f) => {
    if (!Type.isFunction(f) && !Type.isGenericFunction(f)) {
      throw new Error(`Call expression expects a function type, got ${f}`);
    }

    if (f.args.length !== node.args.length) {
      throw new Error(
        `Expected ${f.args.length} arguments, got ${node.args.length}`
      );
    }

    let generic = false;
    f.args.forEach((argType, i) => {
      if (Type.isTypeVariable(argType)) {
        const synthType = synth(node.args[i], env);
        isSubtype(synthType, argType);
        generic = true;
      } else {
        check(node.args[i], argType, env);
      }
    });

    if (generic) {
      if (Type.isGenericFunction(f)) {
        let typeMap: { [key: string]: Type } = {};

        f.params.forEach((param, i) => {
          // this will always be overwritten because we know it's a function with generic params
          let resolvedType: Type = Type.any();
          if (Type.isTypeVariable(param.type)) {
            const argType = synth(node.args[i], env);
            if (typeMap[(param.type as Type.TypeVariable).variable]) {
              resolvedType =
                typeMap[(param.type as Type.TypeVariable).variable];
            } else {
              typeMap[(param.type as Type.TypeVariable).variable] = argType;
              resolvedType =
                typeMap[(param.type as Type.TypeVariable).variable];
            }

            if (!isSubtype(argType, resolvedType)) {
              throw new Error(
                `Expected ${resolvedType} or its subtype for parameter ${param.name}; got ${argType}`
              );
            }
          }

          f.env.set(param.name, resolvedType);
        });
        return synth(f.body, f.env);
      }
    }

    return f.ret;
  });
};

const synthBlock = (node: Block, env: TypeEnv): Type => {
  const returnType = node.expressions.reduce((_: Type, curr: ASTNode) => {
    return synth(curr, env);
  }, Type.any() as Type);

  return returnType;
};

const synthVariableDeclaration = (node: VariableDeclaration, env: TypeEnv) => {
  const type = synth(node.assignment.right, env);
  return type;
};

const synthConstantDeclaration = (node: VariableDeclaration, env: TypeEnv) => {
  const type = synthSingleton(node, env);
  return type;
};

const synthAssignmentExpression = (
  node: AssignmentExpression,
  env: TypeEnv
) => {
  return synth(node.right, env);
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

  return map(left, right, (left: Type, right: Type) => {
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
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.boolean();

      case "<=":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.boolean();

      case ">":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.boolean();

      case ">=":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
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
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.string(),
            left,
            right
          );
        }

        throw new Error(
          `+ only works with 2 strings or 2 numbers; ${left} and ${right} given`
        );

      case "-":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.number();

      case "*":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.number();

      case "/":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.number();

      case "%":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.number();

      case "**":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.number();

      case "<":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.number();

      case "<=":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.number();

      case ">":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.number();

      case ">=":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.number();

      case "&":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.number();

      case "|":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.number();

      case ">>":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.number();

      case "<<":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
        }
        return Type.number();

      case "^":
        if (
          !isSubtype(left, Type.number()) ||
          !isSubtype(right, Type.number())
        ) {
          throwOperatorTypeErrorBinary(
            node.operator,
            Type.number(),
            left,
            right
          );
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
  });
};

const synthLogical = (node: LogicalOperation, env: TypeEnv) => {
  const left = synth(node.left, env);
  const right = () => synth(node.right, env);

  switch (node.operator) {
    case "and":
      if (isFalsy(left)) return left;
      else if (isTruthy(left)) return right();
      else return Type.union(narrowType(left, falsy), right());

    case "or":
      if (isTruthy(left)) return left;
      else if (isFalsy(left)) return right();
      else return Type.union(narrowType(left, truthy), right());

    default:
      throw new Error(`Unimplemented logical operator ${node.operator}`);
  }
};

const synthUnary = (node: UnaryOperation, env: TypeEnv): Type => {
  const expression = synth(node.expression, env);

  return map(expression, (expression) => {
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

      case "+":
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
  });
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

const synthIfExpression = (node: IfExpression, env: TypeEnv): Type => {
  const test = synth(node.test, env);
  const then = synth(node.then, narrow(node.then, env, true));
  const elseType = synth(node.else, narrow(node.test, env, false));

  if (!isSubtype(then, elseType) && !isSubtype(elseType, then)) {
    throw new Error(
      `If expression branches must both evaluate to the same type or one must be a subtype of the other; ${then} and ${elseType} given`
    );
  }

  if (isTruthy(test)) {
    return then;
  } else if (isFalsy(test)) {
    return elseType;
  }

  return Type.union(then, elseType);
};

const synthTuple = (node: Tuple, env: TypeEnv) => {
  const types = node.values.map((v) => synth(v, env));
  return Type.tuple(types);
};

const synthVector = (node: VectorLiteral, env: TypeEnv, constant = false) => {
  const types = node.members.map((m) => synth(m, env, constant));
  return Type.vector(Type.union(...types), constant);
};

const synthSlice = (node: SliceExpression, env: TypeEnv) => {
  const objType = synth(node.obj, env);

  if (Type.isVector(objType)) {
    return objType.type;
  }

  throw new Error(`Slice syntax not implemented for type ${objType}`);
};

const synthStatement = (_node: ForStatement, _env: TypeEnv) => Type.any();
