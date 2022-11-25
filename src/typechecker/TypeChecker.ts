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
import { bind } from "./bind";
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
    const type = synth(node, env);
    check(node, type, env);
    const obj = node.object;
    const prop = node.property;
    let objType = synth(obj, env);

    objType = Type.isTypeAlias(objType) ? getAliasBase(objType) : objType;
    let pt = propType(objType as Type.Object, prop.name); // need to change what this function takes when I allow strings and symbols as property names

    if (!pt) {
      throw new Error(`${prop.name} is not a valid property on the object`);
    }

    pt = Type.isTypeAlias(pt) ? getAliasBase(pt) : pt;

    if (!isSubtype(type, pt)) {
      throw new Error(
        `Derived type ${type} is not compatible with property type ${pt}`
      );
    }

    const boundObj = this.checkNode(obj, env, objType);
    const boundProp = this.checkNode(prop, env, pt);

    return BoundMemberExpression.new(type, boundObj, boundProp, node);
  }
}

export class TypeCheckerOld {
  public diagnostics: DiagnosticBag;

  constructor(public tree: SyntaxTree) {
    this.diagnostics = DiagnosticBag.from(tree.diagnostics);
  }

  public static new(tree: SyntaxTree) {
    return new TypeChecker(tree);
  }

  private checkAsExpression(node: AsExpression, env: TypeEnv) {
    const synthType = synth(node, env);
    return bind(node, env, synthType);
  }

  private checkParenthesizedExpression(
    node: ParenthesizedExpression,
    env: TypeEnv
  ) {
    return bind(node, env);
  }

  private checkLambdaExpression(node: LambdaExpression, env: TypeEnv) {
    const scopeName = `lambda${getScopeNumber(env.name) + 1}`;
    const lambdaEnv = !isSecondPass
      ? env.extend(scopeName)
      : env.getChildEnv(scopeName);

    if (!lambdaEnv) {
      throw new Error(`Could not resolve environment ${scopeName}`);
    }

    try {
      const lambdaType = synth(node, lambdaEnv) as Type.Function;
      check(node, lambdaType, lambdaEnv);
      const bound = bind(node, lambdaEnv, lambdaType);
      return bound;
    } catch (e: any) {
      if (isSecondPass) {
        throw e;
      }

      if (node.body instanceof CallExpression) {
        // undefined function will be set in the environment here
        this.checkCallExpression(node.body, lambdaEnv, true);
        const lambdaType = synth(node, lambdaEnv) as Type.Function;
        check(node, lambdaType, lambdaEnv);

        return bind(node, lambdaEnv, lambdaType);
      }

      throw e;
    }
  }

  private checkCallExpression(
    node: CallExpression,
    env: TypeEnv,
    isFwRef = false
  ) {
    try {
      return bind(node, env, synth(node, env));
    } catch (e: any) {
      if (!isSecondPass && node.func instanceof Identifier && isFwRef) {
        const args = node.args.map((arg) => synth(arg, env));
        env.set(node.func.name, UNDEFINED_FUNCTION(args, node.start));

        return bind(node, env, synth(node, env));
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

  private checkAssignment(node: AssignmentExpression, env: TypeEnv) {
    // there will only be a type annotation in a variable declaration
    let constant = false;
    if (node.left instanceof Identifier) {
      constant = node.left.constant;

      // if this is a variable declaration, it won't be set in the environment yet
      // so if it is set, it's been previously defined and we need to make sure
      // it's not an attempt to reassign a constant
      if (
        env.lookup(node.left.name) &&
        env.get(node.left.name)?.constant === true
      ) {
        throw new Error(
          `Illegal assignment to constant variable ${node.left.name}`
        );
      }
    }

    try {
      const type = node.type
        ? getType(node.type, env)
        : synth(node.right, env, constant);

      if (node.type) {
        check(node.right, type, env);
      }

      return bind(node, env, type);
    } catch (e: any) {
      if (isSecondPass) {
        throw e;
      }

      if (node.right instanceof LambdaExpression) {
        // this should set the undefined function type in the lambda env if it's a forward reference
        this.checkLambdaExpression(node.right, env);
        const lambdaEnv =
          env.getChildEnv(`lambda${getScopeNumber(env.name) + 1}`) ??
          // this should never happen, but putting it here to make the type checker happy
          env.extend(`lambda${getScopeNumber(env.name) + 1}`);
        const lambdaType = synth(node.right, lambdaEnv);
        env.set((node.left as Identifier).name, lambdaType);

        return bind(node, lambdaEnv, lambdaType);
      }

      throw e;
    }
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

    // need to try/catch this in case of legal forward reference
    try {
      const type = node.assignment.type
        ? getType(node.assignment.type, env)
        : synth(node.assignment.right, env, node.constant);

      // Need to set the variable name and type BEFORE checking and binding the assignment node
      env.set((node.assignment.left as Identifier).name, type);

      if (node.assignment.type) {
        check(node, type, env);
      }

      return bind(node, env, type);
    } catch (e: any) {
      if (isSecondPass) {
        throw e;
      }

      if (node.assignment.right instanceof LambdaExpression) {
        // this should set the undefined function type in the lambda env if it's a forward reference
        this.checkLambdaExpression(node.assignment.right, env);
        const lambdaEnv =
          env.getChildEnv(`lambda${getScopeNumber(env.name) + 1}`) ??
          // this should never happen, but putting it here to make the type checker happy
          env.extend(`lambda${getScopeNumber(env.name) + 1}`);
        const lambdaType = synth(node.assignment.right, lambdaEnv);
        env.set((node.assignment.left as Identifier).name, lambdaType);

        return bind(node, lambdaEnv, lambdaType);
      }

      throw e;
    }
  }

  private checkFunctionDeclaration(node: FunctionDeclaration, env: TypeEnv) {
    // need to figure out how to disallow redefining a
    // binding that already exists as a new function
    const name = node.name.name;
    const scopeName = name + (getScopeNumber(env.name) + 1);
    const funcEnv = !isSecondPass
      ? env.extend(scopeName)
      : env.getChildEnv(scopeName);

    if (!funcEnv) {
      throw new Error(`Could not resolve environment ${scopeName}`);
    }

    try {
      const funcType = synth(node, funcEnv) as Type.Function;
      check(node, funcType, funcEnv);
      env.set(name, funcType);
      return bind(node, funcEnv, funcType);
    } catch (e: any) {
      if (isSecondPass) {
        throw e;
      }

      if (!isSecondPass) {
        for (let expr of node.body.expressions) {
          if (expr.kind === SyntaxNodes.CallExpression) {
            // undefined function will be set in the environment here
            this.checkCallExpression(
              expr as CallExpression,
              funcEnv,
              true
            ) as BoundCallExpression;
          }
        }
        const funcType = synth(node, funcEnv) as Type.Function;
        check(node, funcType, funcEnv);
        env.set(name, funcType);
        return bind(node, funcEnv, funcType);
      }
      throw e;
    }
  }

  private checkOperation(
    node: BinaryOperation | LogicalOperation | UnaryOperation,
    env: TypeEnv
  ) {
    const type = synth(node, env);
    return bind(node, env, type);
  }

  private checkIfExpression(node: IfExpression, env: TypeEnv) {
    const type = synth(node, env);
    check(node, type, env);
    return bind(node, env, type);
  }

  private checkTuple(node: Tuple, env: TypeEnv) {
    const type = synth(node, env);
    check(node, type, env);
    return bind(node, env, type);
  }
}
