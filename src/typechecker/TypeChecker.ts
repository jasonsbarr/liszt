import { SyntaxTree } from "../syntax/parser/ast/SyntaxTree";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { ProgramNode } from "../syntax/parser/ast/ProgramNode";
import { IntegerLiteral } from "../syntax/parser/ast/IntegerLiteral";
import { BoundProgramNode } from "./tree/BoundProgramNode";
import { synth } from "./synth";
import { check } from "./check";
import { BoundIntegerLiteral } from "./tree/BoundIntegerLiteral";
import { BoundTree } from "./tree/BoundTree";
import { DiagnosticBag } from "../diagnostics/DiagnosticBag";
import { FloatLiteral } from "../syntax/parser/ast/FloatLiteral";
import { BoundFloatLiteral } from "./tree/BoundFloatLiteral";
import { StringLiteral } from "../syntax/parser/ast/StringLiteral";
import { BoundStringLiteral } from "./tree/BoundStringLiteral";
import { BooleanLiteral } from "../syntax/parser/ast/BooleanLiteral";
import { BoundBooleanLiteral } from "./tree/BoundBooleanLiteral";
import { NilLiteral } from "../syntax/parser/ast/NilLiteral";
import { BoundNilLiteral } from "./tree/BoundNilLiteral";
import { ObjectLiteral } from "../syntax/parser/ast/ObjectLiteral";
import { BoundObjectLiteral } from "./tree/BoundObjectLiteral";
import { BoundObjectProperty } from "./tree/BoundObjectProperty";
import { BoundIdentifier } from "./tree/BoundIdentifier";
import { bind } from "./bind";
import { MemberExpression } from "../syntax/parser/ast/MemberExpression";
import { AsExpression } from "../syntax/parser/ast/AsExpression";
import { ParenthesizedExpression } from "../syntax/parser/ast/ParenthesizedExpression";
import { BoundParenthesizedExpression } from "./tree/BoundParenthesizedExpression";
import { TypeEnv } from "./TypeEnv";

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
      case SyntaxNodes.MemberExpression:
        return this.checkMemberExpression(node as MemberExpression, env);
      case SyntaxNodes.AsExpression:
        return this.checkAsExpression(node as AsExpression, env);
      case SyntaxNodes.ParenthesizedExpression:
        return this.checkParenthesizedExpression(
          node as ParenthesizedExpression,
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

  private checkNilLiteral(node: NilLiteral, env: TypeEnv) {
    this.checkLiteral(node, env);
    return bind(node, env);
  }

  private checkObjectLiteral(node: ObjectLiteral, env: TypeEnv) {
    const synthType = synth(node, env);
    check(node, synthType, env);

    return bind(node, env, synthType);
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
    return BoundParenthesizedExpression.new(node, env);
  }
}
