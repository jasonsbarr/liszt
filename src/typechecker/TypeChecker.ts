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

export class TypeChecker {
  public diagnostics: DiagnosticBag;

  constructor(public tree: SyntaxTree) {
    this.diagnostics = DiagnosticBag.from(tree.diagnostics);
  }

  public static new(tree: SyntaxTree) {
    return new TypeChecker(tree);
  }

  public check() {
    const program = this.tree.root;
    const boundProgram = this.checkNode(program);

    return BoundTree.new(
      boundProgram as BoundProgramNode,
      this.tree.tokens,
      this.diagnostics,
      this.tree.source,
      this.tree.file
    );
  }

  private checkNode(node: ASTNode) {
    switch (node.kind) {
      case SyntaxNodes.ProgramNode:
        return this.checkProgram(node as ProgramNode);
      case SyntaxNodes.IntegerLiteral:
        return this.checkIntegerLiteral(node as IntegerLiteral);
      case SyntaxNodes.FloatLiteral:
        return this.checkFloatLiteral(node as FloatLiteral);
      case SyntaxNodes.StringLiteral:
        return this.checkStringLiteral(node as StringLiteral);
      case SyntaxNodes.BooleanLiteral:
        return this.checkBooleanLiteral(node as BooleanLiteral);
      case SyntaxNodes.NilLiteral:
        return this.checkNilLiteral(node as NilLiteral);
      case SyntaxNodes.ObjectLiteral:
        return this.checkObjectLiteral(node as ObjectLiteral);
      case SyntaxNodes.MemberExpression:
        return this.checkMemberExpression(node as MemberExpression);
      case SyntaxNodes.AsExpression:
        return this.checkAsExpression(node as AsExpression);
      case SyntaxNodes.ParenthesizedExpression:
        return this.checkParenthesizedExpression(
          node as ParenthesizedExpression
        );
      default:
        throw new Error(`Unknown AST node type ${node.kind}`);
    }
  }

  private checkProgram(node: ProgramNode) {
    const nodes = node.children;
    let boundProgram = BoundProgramNode.new(node.start, node.end);

    for (let node of nodes) {
      boundProgram.append(this.checkNode(node));
    }

    return boundProgram;
  }

  private checkLiteral(node: ASTNode) {
    const synthType = synth(node);
    check(node, synthType);
  }

  private checkIntegerLiteral(node: IntegerLiteral) {
    this.checkLiteral(node);
    return bind(node);
  }

  private checkFloatLiteral(node: FloatLiteral) {
    this.checkLiteral(node);
    return bind(node);
  }

  private checkStringLiteral(node: StringLiteral) {
    this.checkLiteral(node);
    return bind(node);
  }

  private checkBooleanLiteral(node: BooleanLiteral) {
    this.checkLiteral(node);
    return bind(node);
  }

  private checkNilLiteral(node: NilLiteral) {
    this.checkLiteral(node);
    return bind(node);
  }

  private checkObjectLiteral(node: ObjectLiteral) {
    const synthType = synth(node);
    check(node, synthType);

    return bind(node, synthType);
  }

  private checkMemberExpression(node: MemberExpression) {
    const synthType = synth(node);
    check(node, synthType);

    return bind(node, synthType);
  }

  private checkAsExpression(node: AsExpression) {
    const synthType = synth(node);
    return bind(node, synthType);
  }

  private checkParenthesizedExpression(node: ParenthesizedExpression) {
    return BoundParenthesizedExpression.new(node);
  }
}
