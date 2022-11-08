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
import { ObjectProperty } from "../syntax/parser/ast/ObjectProperty";

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
      default:
        throw new Error(`Unknown AST node type ${node.kind}`);
    }
  }

  private checkProgram(node: ProgramNode) {
    const nodes = node.children;
    let boundProgram = BoundProgramNode.new(node.start, node.end!);

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
    return BoundIntegerLiteral.new(node.token, node.start);
  }

  private checkFloatLiteral(node: FloatLiteral) {
    this.checkLiteral(node);
    return BoundFloatLiteral.new(node.token, node.start);
  }

  private checkStringLiteral(node: StringLiteral) {
    this.checkLiteral(node);
    return BoundStringLiteral.new(node.token, node.start);
  }

  private checkBooleanLiteral(node: BooleanLiteral) {
    this.checkLiteral(node);
    return BoundBooleanLiteral.new(node.token, node.start);
  }

  private checkNilLiteral(node: NilLiteral) {
    this.checkLiteral(node);
    return BoundNilLiteral.new(node.token, node.start);
  }

  private checkObjectLiteral(node: ObjectLiteral) {
    this.checkLiteral(node);
    const properties = node.properties.map((prop) =>
      BoundObjectProperty.new(
        prop.key,
        prop.value,
        prop.start,
        prop.end!,
        synth(prop)
      )
    );
    return BoundObjectLiteral.new(properties, node.start, node.end!);
  }
}
