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
import { fromAnnotation } from "./fromAnnotation";
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

let isSecondPass = false;
let scopes = 0;
// make sure moduleEnv is only defined once
const moduleEnv =
  TypeEnv.globals.getChildEnv("module0") ??
  TypeEnv.globals.extend(`module${scopes++}`);

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
    scopes = 1;

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

  private checkNode(node: ASTNode, env: TypeEnv) {
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
      case SyntaxNodes.ObjectLiteral:
        return this.checkObjectLiteral(node as ObjectLiteral, env);
      case SyntaxNodes.Identifier:
        return this.checkIdentifier(node as Identifier, env);
      case SyntaxNodes.MemberExpression:
        return this.checkMemberExpression(node as MemberExpression, env);
      case SyntaxNodes.AsExpression:
        return this.checkAsExpression(node as AsExpression, env);
      case SyntaxNodes.ParenthesizedExpression:
        return this.checkParenthesizedExpression(
          node as ParenthesizedExpression,
          env
        );
      case SyntaxNodes.LambdaExpression:
        return this.checkLambdaExpression(node as LambdaExpression, env);
      case SyntaxNodes.CallExpression:
        return this.checkCallExpression(node as CallExpression, env);
      case SyntaxNodes.AssignmentExpression:
        return this.checkAssignment(node as AssignmentExpression, env);
      case SyntaxNodes.VariableDeclaration:
        return this.checkVariableDeclaration(node as VariableDeclaration, env);
      case SyntaxNodes.FunctionDeclaration:
        return this.checkFunctionDeclaration(node as FunctionDeclaration, env);
      case SyntaxNodes.BinaryOperation:
      case SyntaxNodes.LogicalOperation:
      case SyntaxNodes.UnaryOperation:
        return this.checkOperation(
          node as BinaryOperation | LogicalOperation | UnaryOperation,
          env
        );
      default:
        throw new Error(`Unknown AST node type ${node.kind}`);
    }
  }

  private checkProgram(node: ProgramNode, env: TypeEnv) {
    const nodes = node.children;
    let boundProgram = BoundProgramNode.new(node.start, node.end);

    for (let node of nodes) {
      boundProgram.append(this.checkNode(node, env));
    }

    return boundProgram;
  }

  private checkLiteral(node: ASTNode, env: TypeEnv) {
    const synthType = synth(node, env);
    check(node, synthType, env);
  }

  private checkIntegerLiteral(node: IntegerLiteral, env: TypeEnv) {
    this.checkLiteral(node, env);
    return bind(node, env);
  }

  private checkFloatLiteral(node: FloatLiteral, env: TypeEnv) {
    this.checkLiteral(node, env);
    return bind(node, env);
  }

  private checkStringLiteral(node: StringLiteral, env: TypeEnv) {
    this.checkLiteral(node, env);
    return bind(node, env);
  }

  private checkBooleanLiteral(node: BooleanLiteral, env: TypeEnv) {
    this.checkLiteral(node, env);
    return bind(node, env);
  }

  private checkSymbolLiteral(node: SymbolLiteral, env: TypeEnv) {
    this.checkLiteral(node, env);
    return bind(node, env);
  }

  private checkNilLiteral(node: NilLiteral, env: TypeEnv) {
    this.checkLiteral(node, env);
    return bind(node, env);
  }

  private checkObjectLiteral(node: ObjectLiteral, env: TypeEnv) {
    const synthType = synth(node, env);
    check(node, synthType, env);

    return bind(node, env, synthType);
  }

  private checkIdentifier(node: Identifier, env: TypeEnv) {
    try {
      let type: Type = env.get(node.name);

      if (isSecondPass) {
        let varTypeInCurrentScope: Type | undefined = env.get(node.name);
        let currentScope: TypeEnv | undefined = env;

        while (
          Type.isUNDEFINED(varTypeInCurrentScope) ||
          (Type.isFunction(varTypeInCurrentScope) &&
            isUndefinedFunction(varTypeInCurrentScope))
        ) {
          env.delete(node.name);
          currentScope = env.parent;
          varTypeInCurrentScope = currentScope?.get(node.name);

          if (!varTypeInCurrentScope) break;
        }

        if (varTypeInCurrentScope) {
          type = varTypeInCurrentScope;
        }
      }

      return bind(node, env, type);
    } catch (e: any) {
      if (isSecondPass) {
        throw e;
      }

      // This should only happen on the first pass and with a binding that hasn't been declared yet
      if (!isSecondPass && !env.has(node.name)) {
        const loc = node.start;
        const type = Type.undefinedType(loc);
        env.set(node.name, type);
        return bind(node, env, type);
      }

      throw new Error("I don't know what happened");
    }
  }

  private checkMemberExpression(node: MemberExpression, env: TypeEnv) {
    const synthType = synth(node, env);
    check(node, synthType, env);

    return bind(node, env, synthType);
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
    const scopeName = `lambda${scopes++}`;
    const lambdaEnv = !isSecondPass
      ? env.extend(scopeName)
      : env.getChildEnv(scopeName);

    if (!lambdaEnv) {
      throw new Error(`Could not resolve environment ${scopeName}`);
    }

    const lambdaType = synth(node, env) as Type.Function;
    check(node, lambdaType, lambdaEnv);
    const bound = bind(node, lambdaEnv, lambdaType);
    return bound;
  }

  private checkCallExpression(node: CallExpression, env: TypeEnv) {
    try {
      return bind(node, env, synth(node, env));
    } catch (e: any) {
      if (!isSecondPass && node.func instanceof Identifier) {
        const args = node.args.map((arg) => synth(arg, env));
        env.set(node.func.name, UNDEFINED_FUNCTION(args, node.start));

        return bind(node, env, synth(node, env));
      } else if (
        isSecondPass &&
        isUndefinedFunction(synth(node, env) as Type.Function)
      ) {
        throw new Error(
          `Function ${(node.func as Identifier).name} is not defined`
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
      if (
        env.lookup(node.left.name) &&
        env.get(node.left.name)?.constant === true
      ) {
        throw new Error(
          `Illegal assignment to constant variable ${node.left.name}`
        );
      }
    }

    const type = node.type
      ? fromAnnotation(node.type)
      : synth(node.right, env, constant);

    if (node.type) {
      check(node.right, type, env);
    }

    return bind(node, env, type);
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

    // need to try/catch this in case of forward reference
    const type = node.assignment.type
      ? fromAnnotation(node.assignment.type)
      : synth(node.assignment.right, env, node.constant);

    // Need to set the variable name and type BEFORE checking and binding the assignment node
    env.set((node.assignment.left as Identifier).name, type);

    if (node.assignment.type) {
      check(node, type, env);
    }

    return bind(node, env, type);
  }

  private checkFunctionDeclaration(node: FunctionDeclaration, env: TypeEnv) {
    // need to figure out how to disallow redefining a
    // binding that already exists as a new function
    const name = node.name.name;
    const scopeName = name;
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
      if (!isSecondPass) {
        for (let expr of node.body.expressions) {
          if (expr.kind === SyntaxNodes.CallExpression) {
            // undefined function will be set in the environment here
            this.checkCallExpression(
              expr as CallExpression,
              funcEnv
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
}
