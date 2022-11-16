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

export class TypeChecker {
  public diagnostics: DiagnosticBag;

  constructor(public tree: SyntaxTree) {
    this.diagnostics = DiagnosticBag.from(tree.diagnostics);
  }

  public static new(tree: SyntaxTree) {
    return new TypeChecker(tree);
  }

  public check(env = TypeEnv.globals) {
    const program = this.tree.root;
    const boundProgram = this.checkNode(program, env);

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
    return bind(node, env);
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
    const lambdaEnv = env.extend();
    const lambdaType = synth(node, env) as Type.Function;
    check(node, lambdaType, lambdaEnv);
    const bound = bind(node, lambdaEnv, lambdaType);
    return bound;
  }

  private checkCallExpression(node: CallExpression, env: TypeEnv) {
    const synthRetType = synth(node, env);
    return bind(node, env, synthRetType);
  }

  private checkAssignment(node: AssignmentExpression, env: TypeEnv) {
    // there will only be a type annotation in a variable declaration
    let type: Type;

    if (node.type) {
      type = fromAnnotation(node.type);
      check(node.right, type, env);
    } else {
      type = synth(node.right, env);
    }

    return bind(node, env, type);
  }

  private checkVariableDeclaration(node: VariableDeclaration, env: TypeEnv) {
    let type: Type;

    if (node.assignment.type) {
      type = fromAnnotation(node.assignment.type);
      check(node, type, env);
    } else {
      type = synth(node.assignment.right, env, node.constant);
    }

    // Need to set the variable name and type BEFORE binding the assignment node
    env.set((node.assignment.left as Identifier).name, type);
    return bind(node, env, type);
  }

  private checkFunctionDeclaration(node: FunctionDeclaration, env: TypeEnv) {
    const funcEnv = env.extend();
    const funcType = synth(node, funcEnv) as Type.Function;
    check(node, funcType, funcEnv);
    env.set(node.name.name, funcType);
    return bind(node, funcEnv, funcType);
  }
}
