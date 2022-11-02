import { SyntaxTree } from "../parser/ast/SyntaxTree";
import { SyntaxNodes } from "../parser/ast/SyntaxNodes";
import { ASTNode } from "../parser/ast/ASTNode";
import { ProgramNode } from "../parser/ast/ProgramNode";
import { IntegerLiteral } from "../parser/ast/IntegerLiteral";
import { BoundProgramNode } from "./tree/BoundProgramNode";
import { synth } from "./synth";
import { check } from "./check";
import { BoundIntegerLiteral } from "./tree/BoundIntegerLiteral";
import { BoundTree } from "./tree/BoundTree";
import { DiagnosticBag } from "../diagnostics/DiagnosticBag";

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
      default:
        throw new Error(`Unknown AST node type ${node.kind}`);
    }
  }

  private checkProgram(node: ProgramNode) {
    const nodes = node.children;
    let boundProgram = BoundProgramNode.new(node.start, node.end!);

    for (let node of nodes) {
      boundProgram.children.push(this.checkNode(node));
    }

    return boundProgram;
  }

  private checkIntegerLiteral(node: IntegerLiteral) {
    const synthType = synth(node);
    check(node, synthType);

    return BoundIntegerLiteral.new(node.token, node.start);
  }
}
