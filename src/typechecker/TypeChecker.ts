import { SyntaxTree } from "../syntax/parser/ast/SyntaxTree";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { ProgramNode } from "../syntax/parser/ast/ProgramNode";
import { IntegerLiteral } from "../syntax/parser/ast/IntegerLiteral";
import { BoundProgramNode } from "./bound/BoundProgramNode";
import { synth } from "./synth";
import { check } from "./check";
import { BoundTree } from "./bound/BoundTree";
import { DiagnosticBag } from "../diagnostics/DiagnosticBag";
import { FloatLiteral } from "../syntax/parser/ast/FloatLiteral";
import { StringLiteral } from "../syntax/parser/ast/StringLiteral";
import { BooleanLiteral } from "../syntax/parser/ast/BooleanLiteral";
import { NilLiteral } from "../syntax/parser/ast/NilLiteral";
import { ObjectLiteral } from "../syntax/parser/ast/ObjectLiteral";
import { MemberExpression } from "../syntax/parser/ast/MemberExpression";
import { AsExpression } from "../syntax/parser/ast/AsExpression";
import { ParenthesizedExpression } from "../syntax/parser/ast/ParenthesizedExpression";
import { TypeEnv } from "./TypeEnv";
import { LambdaExpression } from "../syntax/parser/ast/LambdaExpression";
import { Type } from "./Type";
import { CallExpression } from "../syntax/parser/ast/CallExpression";
import { AssignmentExpression } from "../syntax/parser/ast/AssignmentExpression";
import { VariableDeclaration } from "../syntax/parser/ast/VariableDeclaration";
import { Identifier } from "../syntax/parser/ast/Identifier";
import { FunctionDeclaration } from "../syntax/parser/ast/FunctionDeclaration";
import {
  isUndefinedFunction,
  UNDEFINED_FUNCTION,
} from "../utils/UndefinedFunction";
import { BoundCallExpression } from "./bound/BoundCallExpression";
import { BinaryOperation } from "../syntax/parser/ast/BinaryOperation";
import { LogicalOperation } from "../syntax/parser/ast/LogicalOperation";
import { UnaryOperation } from "../syntax/parser/ast/UnaryOperation";
import { SymbolLiteral } from "../syntax/parser/ast/SymbolLiteral";
import { IfExpression } from "../syntax/parser/ast/IfExpression";
import { TypeAlias } from "../syntax/parser/ast/TypeAlias";
import { getType } from "./getType";
import { Tuple } from "../syntax/parser/ast/Tuple";
import { BoundASTNode } from "./bound/BoundASTNode";
import { PrimitiveNode } from "../syntax/parser/ast/PrimitiveNode";
import { BoundIntegerLiteral } from "./bound/BoundIntegerLiteral";
import { BoundFloatLiteral } from "./bound/BoundFloatLiteral";
import { BoundStringLiteral } from "./bound/BoundStringLiteral";
import { BoundBooleanLiteral } from "./bound/BoundBooleanLiteral";
import { BoundSymbolLiteral } from "./bound/BoundSymbolLiteral";
import { BoundNilLiteral } from "./bound/BoundNilLiteral";
import { BoundObjectLiteral } from "./bound/BoundObjectLiteral";
import { BoundIdentifier } from "./bound/BoundIdentifier";
import { ObjectProperty } from "../syntax/parser/ast/ObjectProperty";
import { Property } from "./Types";
import { BoundObjectProperty } from "./bound/BoundObjectProperty";
import { getAliasBase } from "./getAliasBase";
import { propType } from "./propType";
import { isSubtype } from "./isSubtype";
import { BoundMemberExpression } from "./bound/BoundMemberExpression";
import { BoundParenthesizedExpression } from "./bound/BoundParenthesizedExpression";
import { BoundLambdaExpression } from "./bound/BoundLambdaExpression";
import { BoundParameter } from "./bound/BoundParameter";
import { BoundAssignmentExpression } from "./bound/BoundAssignmentExpression";
import { BoundVariableDeclaration } from "./bound/BoundVariableDeclaration";
import { Block } from "../syntax/parser/ast/Block";
import { ReturnStatement } from "../syntax/parser/ast/ReturnStatement";
import { BoundReturnStatement } from "./bound/BoundReturnStatement";
import { BoundBlock } from "./bound/BoundBlock";
import { BoundFunctionDeclaration } from "./bound/BoundFunctionDeclaration";
import { BoundBinaryOperation } from "./bound/BoundBinaryOperation";
import { BoundLogicalOperation } from "./bound/BoundLogicalOperation";
import { BoundUnaryOperation } from "./bound/BoundUnaryOperation";
import { BoundIfExpression } from "./bound/BoundIfExpression";
import { BoundTuple } from "./bound/BoundTuple";

let isSecondPass = false;
const getScopeNumber = (scopeName: string) => {
  return Number(scopeName.slice(-1));
};

// make sure moduleEnv is only defined once
const moduleEnv =
  TypeEnv.globals.getChildEnv("module0") ?? TypeEnv.globals.extend(`module0`);

export class TypeChecker {
  public diagnostics: DiagnosticBag;

  constructor(public tree: SyntaxTree) {
    this.diagnostics = DiagnosticBag.from(tree.diagnostics);
  }

  public static new(tree: SyntaxTree) {
    return new TypeChecker(tree);
  }

  public check(env = moduleEnv) {
    const program = this.tree.root;

    // first pass is to populate environments so valid forward references will resolve
    this.checkNode(program, env);
    isSecondPass = true;

    const boundProgram = this.checkNode(program, env);
    isSecondPass = false;

    return BoundTree.new(
      boundProgram as BoundProgramNode,
      this.tree.tokens,
      this.diagnostics,
      this.tree.source,
      this.tree.file
    );
  }

  private checkNode(node: ASTNode, env: TypeEnv, type?: Type): BoundASTNode {
    switch (node.kind) {
      case SyntaxNodes.ProgramNode:
        return this.checkProgram(node as ProgramNode, env);

      case SyntaxNodes.IntegerLiteral:
        return this.checkIntegerLiteral(node as IntegerLiteral, env);

      case SyntaxNodes.FloatLiteral:
        return this.checkFloatLiteral(node as FloatLiteral, env);

      case SyntaxNodes.StringLiteral:
        return this.checkStringLiteral(node as StringLiteral, env);

      case SyntaxNodes.BooleanLiteral:
        return this.checkBooleanLiteral(node as BooleanLiteral, env);

      case SyntaxNodes.SymbolLiteral:
        return this.checkSymbolLiteral(node as SymbolLiteral, env);

      case SyntaxNodes.NilLiteral:
        return this.checkNilLiteral(node as NilLiteral, env);

      case SyntaxNodes.Identifier:
        return this.checkIdentifier(node as Identifier, env, type);

      case SyntaxNodes.ObjectLiteral:
        return this.checkObjectLiteral(node as ObjectLiteral, env);

      case SyntaxNodes.MemberExpression:
        return this.checkMemberExpression(node as MemberExpression, env);

      case SyntaxNodes.AsExpression:
        return this.checkAsExpression(node as AsExpression, env);

      case SyntaxNodes.ParenthesizedExpression:
        return this.checkParenthesizedExpression(
          node as ParenthesizedExpression,
          env
        );

      case SyntaxNodes.CallExpression:
        return this.checkCallExpression(node as CallExpression, env);

      case SyntaxNodes.LambdaExpression:
        return this.checkLambdaExpression(node as LambdaExpression, env);

      case SyntaxNodes.AssignmentExpression:
        return this.checkAssignment(node as AssignmentExpression, env);

      case SyntaxNodes.VariableDeclaration:
        return this.checkVariableDeclaration(node as VariableDeclaration, env);

      case SyntaxNodes.Block:
        return this.checkBlock(node as Block, env, type);

      case SyntaxNodes.ReturnStatement:
        return this.checkReturn(node as ReturnStatement, env, type);

      case SyntaxNodes.FunctionDeclaration:
        return this.checkFunctionDeclaration(node as FunctionDeclaration, env);

      case SyntaxNodes.BinaryOperation:
        return this.checkBinaryOperation(node as BinaryOperation, env);

      case SyntaxNodes.LogicalOperation:
        return this.checkLogicalOperation(node as LogicalOperation, env);

      case SyntaxNodes.UnaryOperation:
        return this.checkUnaryOperation(node as UnaryOperation, env);

      case SyntaxNodes.IfExpression:
        return this.checkIfExpression(node as IfExpression, env);

      case SyntaxNodes.Tuple:
        return this.checkTuple(node as Tuple, env);

      default:
        throw new Error(`Unknown AST node kind ${node.kind}`);
    }
  }

  private checkProgram(node: ProgramNode, env: TypeEnv) {
    const nodes = node.children;
    let boundProgram = BoundProgramNode.new(node.start, node.end);

    for (let node of nodes) {
      let boundNode: BoundASTNode | undefined = this.checkNode(node, env);

      if (boundNode) {
        boundProgram.append(boundNode);
      }
    }

    return boundProgram;
  }

  private checkLiteral(node: PrimitiveNode, env: TypeEnv) {
    const type = synth(node, env);
    check(node, type, env);
    return type;
  }

  private checkIntegerLiteral(node: IntegerLiteral, env: TypeEnv) {
    this.checkLiteral(node, env);
    return BoundIntegerLiteral.new(node);
  }

  private checkFloatLiteral(node: FloatLiteral, env: TypeEnv) {
    this.checkLiteral(node, env);
    return BoundFloatLiteral.new(node);
  }

  private checkStringLiteral(node: StringLiteral, env: TypeEnv) {
    this.checkLiteral(node, env);
    return BoundStringLiteral.new(node);
  }

  private checkBooleanLiteral(node: BooleanLiteral, env: TypeEnv) {
    this.checkLiteral(node, env);
    return BoundBooleanLiteral.new(node);
  }

  private checkSymbolLiteral(node: SymbolLiteral, env: TypeEnv) {
    this.checkLiteral(node, env);
    return BoundSymbolLiteral.new(node);
  }

  private checkNilLiteral(node: NilLiteral, env: TypeEnv) {
    this.checkLiteral(node, env);
    return BoundNilLiteral.new(node);
  }

  private checkIdentifier(node: Identifier, env: TypeEnv, type?: Type) {
    try {
      type = type ? type : env.get(node.name);

      if (isSecondPass) {
        let currentScope: TypeEnv | undefined = env;

        // any undefined identifier reference has been set in its scope to undefined
        // to check for variable reference before definition - we need to delete
        // these undefined types until we get to the scope the identifier was
        // originally declared in - at which point the loop condition will
        // be false. If we go all the way up the scope chain and never
        // resolve a reference that isn't undefined, throw an error.
        while (
          Type.isUNDEFINED(type) ||
          (Type.isFunction(type) && isUndefinedFunction(type))
        ) {
          env.delete(node.name);
          currentScope = env.parent;
          type = currentScope?.get(node.name);

          if (!type) {
            throw new Error(`Identifier ${node.name} is undefined`);
          }
        }
      }

      return BoundIdentifier.new(type, node);
    } catch (e: any) {
      if (!isSecondPass) {
        const loc = node.start;
        const type = Type.undefinedType(loc);
        env.set(node.name, type);
        return BoundIdentifier.new(type, node);
      }

      throw e;
    }
  }

  private checkObjectLiteral(node: ObjectLiteral, env: TypeEnv) {
    const type = synth(node, env) as Type.Object;
    const properties = node.properties.map((prop, i) =>
      this.checkObjectProperty(prop, env, type.properties[i])
    );

    return BoundObjectLiteral.new(type, properties, node);
  }

  private checkObjectProperty(
    node: ObjectProperty,
    env: TypeEnv,
    prop: Property
  ) {
    const type = prop.type;
    const key = this.checkNode(node.key, env, type);
    const value = this.checkNode(node.value, env);
    return BoundObjectProperty.new(key, value, type, node);
  }

  private checkMemberExpression(node: MemberExpression, env: TypeEnv) {
    const ty = synth(node, env);
    check(node, ty, env);
    const obj = node.object;
    const prop = node.property;
    let objType = synth(obj, env);

    objType = Type.isTypeAlias(objType) ? getAliasBase(objType) : objType;
    let pt = propType(objType as Type.Object, prop.name); // need to change what this function takes when I allow strings and symbols as property names

    if (!pt) {
      throw new Error(`${prop.name} is not a valid property on the object`);
    }

    pt = Type.isTypeAlias(pt) ? getAliasBase(pt) : pt;

    if (!isSubtype(ty, pt)) {
      throw new Error(
        `Derived type ${ty} is not compatible with property type ${pt}`
      );
    }

    const boundObj = this.checkNode(obj, env, objType);
    const boundProp = this.checkNode(prop, env, pt);

    return BoundMemberExpression.new(ty, boundObj, boundProp, node);
  }

  private checkAsExpression(node: AsExpression, env: TypeEnv) {
    const type = synth(node, env);
    return this.checkNode(node.expression, env, type);
  }

  private checkParenthesizedExpression(
    node: ParenthesizedExpression,
    env: TypeEnv
  ) {
    const type = synth(node.expression, env);
    const expr = this.checkNode(node.expression, env, type);
    return BoundParenthesizedExpression.new(expr, node.start, node.end);
  }

  private checkCallExpression(node: CallExpression, env: TypeEnv) {
    try {
      const type = synth(node, env);
      const callArgs = node.args.map((arg) => this.checkNode(arg, env));
      const callFunc = this.checkNode(node.func, env);

      return BoundCallExpression.new(
        callArgs,
        callFunc,
        type,
        node.start,
        node.end
      );
    } catch (e: any) {
      if (!isSecondPass && node.func instanceof Identifier) {
        const argTypes = node.args.map((arg) => synth(arg, env));

        env.set(node.func.name, UNDEFINED_FUNCTION(argTypes, node.start));

        const type = synth(node, env);
        const callArgs = node.args.map((arg) => this.checkNode(arg, env));
        const callFunc = this.checkNode(node.func, env);

        return BoundCallExpression.new(
          callArgs,
          callFunc,
          type,
          node.start,
          node.end
        );
      } else if (
        isSecondPass &&
        isUndefinedFunction(synth(node, env) as Type.Function)
      ) {
        throw new Error(
          `Function ${
            node.func instanceof Identifier ? node.func.name : node.func.kind
          } is not defined`
        );
      } else {
        throw e;
      }
    }
  }

  private checkLambdaExpression(
    node: LambdaExpression,
    env: TypeEnv,
    type?: Type
  ) {
    const scopeName = `lambda${getScopeNumber(env.name) + 1}`;
    const lambdaEnv = !isSecondPass
      ? env.extend(scopeName)
      : env.getChildEnv(scopeName);

    if (!lambdaEnv) {
      throw new Error(`Could not resolve environment ${scopeName}`);
    }

    const lambdaType = type
      ? (type as Type.Function)
      : (synth(node, lambdaEnv) as Type.Function);
    check(node, lambdaType, lambdaEnv);
    const lambdaBody = this.checkNode(node.body, lambdaEnv);
    const lambdaArgs = node.params.map((p) =>
      BoundParameter.new(p, p.type ? getType(p.type, lambdaEnv) : Type.any())
    );

    return BoundLambdaExpression.new(node, lambdaBody, lambdaType, lambdaArgs);
  }

  private checkAssignment(
    node: AssignmentExpression,
    env: TypeEnv,
    type?: Type
  ) {
    let constant = false;
    if (node.left instanceof Identifier) {
      constant = node.left.constant;

      // if this is a variable declaration, it won't be set in the environment yet
      // so if it is set, it's been previously defined and we need to make sure
      // it's not an attempt to reassign a constant
      if (env.lookup(node.left.name) && env.get(node.left.name)?.constant) {
        throw new Error(
          `Illegal assignment to constant variable ${node.left.name}`
        );
      }
    }

    const t = type
      ? type
      : node.type
      ? getType(node.type, env)
      : synth(node.right, env, constant);
    const left = this.checkNode(node.left, env, type);
    const right = this.checkNode(node.right, env, type);

    if (node.type) {
      check(node.right, t, env);
    }

    if (node.left instanceof Identifier) {
      if (env.lookup(node.left.name)) {
        // if already defined, need to make sure we're not assigning
        // an incompatible type to the same variable name
        const checkType = env.get(node.left.name);

        if (!isSubtype(t, checkType)) {
          throw new Error(
            `Cannot assign value of type ${t} to variable of type ${checkType}`
          );
        }
      }
    }

    return BoundAssignmentExpression.new(
      left,
      right,
      node.operator,
      node.start,
      node.end,
      t
    );
  }

  private checkVariableDeclaration(node: VariableDeclaration, env: TypeEnv) {
    if (node.assignment.left instanceof Identifier) {
      const name = node.assignment.left.name;

      if (env.has(name) && Type.isUNDEFINED(env.get(name)) && isSecondPass) {
        throw new Error(
          `Cannot reference name ${name} prior to initialization`
        );
      }

      if (env.has(name) && !isSecondPass) {
        throw new Error(`Variable ${name} has already been declared`);
      }
    }

    const type = node.assignment.type
      ? getType(node.assignment.type, env)
      : synth(node.assignment.right, env, node.constant);

    // Need to set the variable name and type BEFORE checking and binding the assignment node
    env.set((node.assignment.left as Identifier).name, type);

    const assign = this.checkNode(
      node.assignment,
      env,
      type
    ) as BoundAssignmentExpression;

    return BoundVariableDeclaration.new(
      assign,
      node.constant,
      type,
      node.start,
      node.end
    );
  }

  private checkBlock(node: Block, env: TypeEnv, type?: Type) {
    const expressions = node.expressions;
    const boundNodes = expressions.map((expr, i, a) => {
      let t = synth(expr, env);
      if (i === a.length - 1) {
        if (type) {
          if (!isSubtype(t, type)) {
            throw new Error(`${type} is not a valid subtype of ${t}`);
          }
        }
      }
      return this.checkNode(expr, env, t);
    });
    const returnType = expressions.reduce(
      (_: Type, curr: ASTNode) => synth(curr, env),
      Type.any() as Type
    );

    return BoundBlock.new(boundNodes, returnType, node.start, node.end);
  }

  private checkReturn(node: ReturnStatement, env: TypeEnv, type?: Type) {
    if (type) {
      check(node, type, env);
    } else {
      type = synth(node, env);
    }

    const expr = this.checkNode(node.expression, env);

    return BoundReturnStatement.new(expr, type, node.start, node.end);
  }

  private checkFunctionDeclaration(node: FunctionDeclaration, env: TypeEnv) {
    const name = node.name.name;
    const scopeName = name + (getScopeNumber(env.name) + 1);
    const funcEnv = !isSecondPass
      ? env.extend(scopeName)
      : env.getChildEnv(scopeName);

    if (!funcEnv) {
      throw new Error(`Could not resolve environment ${scopeName}`);
    }

    const funcType = synth(node, funcEnv) as Type.Function;
    check(node, funcType, funcEnv);
    env.set(name, funcType);

    const funcName = this.checkNode(node.name, env) as BoundIdentifier;
    const boundParams = node.params.map((p) =>
      BoundParameter.new(p, p.type ? getType(p.type, env) : Type.any())
    );
    const boundBody = this.checkNode(node.body, funcEnv) as BoundBlock;

    return BoundFunctionDeclaration.new(
      funcName,
      boundParams,
      boundBody,
      funcType.ret,
      node.start,
      node.end
    );
  }

  private checkBinaryOperation(node: BinaryOperation, env: TypeEnv) {
    const left = this.checkNode(node.left, env);
    const right = this.checkNode(node.right, env);
    const op = node.operator;
    const t = synth(node, env);

    return BoundBinaryOperation.new(left, right, op, node.start, node.end, t);
  }

  private checkLogicalOperation(node: LogicalOperation, env: TypeEnv) {
    const left = this.checkNode(node.left, env);
    const right = this.checkNode(node.right, env);
    const op = node.operator;
    const t = synth(node, env);

    return BoundLogicalOperation.new(left, right, op, node.start, node.end, t);
  }

  private checkUnaryOperation(node: UnaryOperation, env: TypeEnv) {
    const expr = this.checkNode(node.expression, env);
    const op = node.operator;
    const t = synth(node, env);

    return BoundUnaryOperation.new(expr, op, node.start, node.end, t);
  }

  private checkIfExpression(node: IfExpression, env: TypeEnv) {
    const type = synth(node, env);
    const test = this.checkNode(node.test, env);
    const then = this.checkNode(node.then, env);
    const elseNode = this.checkNode(node.else, env);

    return BoundIfExpression.new(
      test,
      then,
      elseNode,
      type,
      node.start,
      node.end
    );
  }

  private checkTuple(node: Tuple, env: TypeEnv) {
    let type = synth(node, env) as Type.Tuple;
    check(node, type, env);

    if (Type.isTypeAlias(type)) {
      type = getAliasBase(type) as Type.Tuple;
    }

    const values = node.values.map((v, i) =>
      this.checkNode(v, env, type.types[i])
    );

    return BoundTuple.new(values, type, node.start, node.end);
  }
}
