import { AssignmentExpression } from "../syntax/parser/ast/AssignmentExpression";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { CallExpression } from "../syntax/parser/ast/CallExpression";
import { VariableDeclaration } from "../syntax/parser/ast/VariableDeclaration";
import { BoundAssignmentExpression } from "../typechecker/bound/BoundAssignmentExpression";
import { BoundBlock } from "../typechecker/bound/BoundBlock";
import { BoundBooleanLiteral } from "../typechecker/bound/BoundBooleanLiteral";
import { BoundCallExpression } from "../typechecker/bound/BoundCallExpression";
import { BoundFloatLiteral } from "../typechecker/bound/BoundFloatLiteral";
import { BoundFunctionDeclaration } from "../typechecker/bound/BoundFunctionDeclaration";
import { BoundIdentifier } from "../typechecker/bound/BoundIdentifier";
import { BoundIntegerLiteral } from "../typechecker/bound/BoundIntegerLiteral";
import { BoundLambdaExpression } from "../typechecker/bound/BoundLambdaExpression";
import { BoundMemberExpression } from "../typechecker/bound/BoundMemberExpression";
import { BoundNilLiteral } from "../typechecker/bound/BoundNilLiteral";
import { BoundNodes } from "../typechecker/bound/BoundNodes";
import { BoundObjectLiteral } from "../typechecker/bound/BoundObjectLiteral";
import { BoundParenthesizedExpression } from "../typechecker/bound/BoundParenthesizedExpression";
import { BoundProgramNode } from "../typechecker/bound/BoundProgramNode";
import { BoundReturnStatement } from "../typechecker/bound/BoundReturnStatement";
import { BoundStringLiteral } from "../typechecker/bound/BoundStringLiteral";
import { BoundTree } from "../typechecker/bound/BoundTree";
import { BoundVariableDeclaration } from "../typechecker/bound/BoundVariableDeclaration";

export class Emitter {
  constructor(public tree: BoundTree) {}

  public static new(tree: BoundTree) {
    return new Emitter(tree);
  }

  public emit() {
    const program = this.tree.root;

    return this.emitNode(program);
  }

  private emitNode(node: ASTNode) {
    switch (node.kind) {
      case BoundNodes.BoundProgramNode:
        return this.emitProgram(node as BoundProgramNode);
      case BoundNodes.BoundIntegerLiteral:
        return this.emitInteger(node as BoundIntegerLiteral);
      case BoundNodes.BoundFloatLiteral:
        return this.emitFloat(node as BoundFloatLiteral);
      case BoundNodes.BoundStringLiteral:
        return this.emitString(node as BoundStringLiteral);
      case BoundNodes.BoundBooleanLiteral:
        return this.emitBoolean(node as BoundBooleanLiteral);
      case BoundNodes.BoundNilLiteral:
        return this.emitNil(node as BoundNilLiteral);
      case BoundNodes.BoundIdentifier:
        return this.emitIdentifier(node as BoundIdentifier);
      case BoundNodes.BoundObjectLiteral:
        return this.emitObject(node as BoundObjectLiteral);
      case BoundNodes.BoundMemberExpression:
        return this.emitMemberExpression(node as BoundMemberExpression);
      case BoundNodes.BoundParenthesizedExpression:
        return this.emitParenthesizedExpression(
          node as BoundParenthesizedExpression
        );
      case BoundNodes.BoundLambdaExpression:
        return this.emitLambdaExpression(node as BoundLambdaExpression);
      case BoundNodes.BoundCallExpression:
        return this.emitCallExpression(node as BoundCallExpression);
      case BoundNodes.BoundAssignmentExpression:
        return this.emitAssignment(node as BoundAssignmentExpression);
      case BoundNodes.BoundVariableDeclaration:
        return this.emitVariableDeclaration(node as BoundVariableDeclaration);
      case BoundNodes.BoundFunctionDeclaration:
        return this.emitFunctionDeclaration(node as BoundFunctionDeclaration);
      case BoundNodes.BoundBlock:
        return this.emitBlock(node as BoundBlock);
      case BoundNodes.BoundReturnStatement:
        return this.emitReturnStatement(node as BoundReturnStatement);
      default:
        throw new Error(`Unknown bound node type ${node.kind}`);
    }
  }

  private emitProgram(node: BoundProgramNode) {
    const nodes = node.children;
    let code = "";

    for (let node of nodes) {
      code += this.emitNode(node);
    }

    return code;
  }

  private emitInteger(node: BoundIntegerLiteral) {
    return `${node.token.value}n`;
  }

  private emitFloat(node: BoundFloatLiteral) {
    return node.token.value;
  }

  private emitString(node: BoundStringLiteral) {
    const value = node.token.value.slice(1, -1);
    return "`" + value + "`";
  }

  private emitBoolean(node: BoundBooleanLiteral) {
    return node.token.value;
  }

  private emitNil(_node: BoundNilLiteral) {
    return "null";
  }

  private emitIdentifier(node: BoundIdentifier) {
    return node.token.value;
  }

  private emitObject(node: BoundObjectLiteral) {
    let code = "({";

    code += node.properties
      .map(({ key, value }) => {
        return `${this.emitIdentifier(key as BoundIdentifier)}: ${this.emitNode(
          value
        )}`;
      })
      .join(", ");

    code += "})";

    return code;
  }

  private emitMemberExpression(node: BoundMemberExpression): string {
    return `${this.emitNode(node.object)}["${this.emitNode(node.property)}"]`;
  }

  private emitParenthesizedExpression(
    node: BoundParenthesizedExpression
  ): string {
    return `(${this.emitNode(node.expression)})`;
  }

  private emitLambdaExpression(node: BoundLambdaExpression) {
    let code = "(";
    code += node.args.map((arg) => arg.name.name).join(", ");
    code += ") => ";
    code += this.emitNode(node.body);

    return code;
  }

  private emitCallExpression(node: CallExpression): string {
    let code = `${this.emitNode(node.func)}`;
    code += `(${node.args.map((arg) => this.emitNode(arg)).join(", ")})`;
    return code;
  }

  private emitAssignment(node: BoundAssignmentExpression): string {
    return `${this.emitNode(node.left)} ${node.operator.value} ${this.emitNode(
      node.right
    )}`;
  }

  private emitVariableDeclaration(node: BoundVariableDeclaration): string {
    if (node.constant) {
      return `const ${this.emitNode(node.assignment)};\n`;
    }

    return `let ${this.emitNode(node.assignment)};\n`;
  }

  private emitFunctionDeclaration(node: BoundFunctionDeclaration): string {
    let code = `\nfunction ${node.name.name}(`;
    code += node.parameters.map((p) => p.name.name).join(", ") + ") {\n";
    code += `return ${this.emitBlock(node.body)}`;
    code += "}\n\n";

    return code;
  }

  private emitBlock(node: BoundBlock): string {
    let code = "(function() {\n";
    code += `${node.expressions
      .map((expr, i, a) => {
        if (expr.kind === BoundNodes.BoundReturnStatement) {
          return this.emitNode(expr);
        } else if (i === a.length - 1) {
          return `return ${this.emitNode(expr)};`;
        }
        return this.emitNode(expr);
      })
      .join("")}`;
    code += "\n})();\n";

    return code;
  }

  private emitReturnStatement(node: BoundReturnStatement): string {
    return `return ${this.emitNode(node.expression)};`;
  }
}
