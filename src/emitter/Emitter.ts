import { AssignmentExpression } from "../syntax/parser/ast/AssignmentExpression";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { CallExpression } from "../syntax/parser/ast/CallExpression";
import { VariableDeclaration } from "../syntax/parser/ast/VariableDeclaration";
import { BoundAssignmentExpression } from "../typechecker/bound/BoundAssignmentExpression";
import { BoundASTNode } from "../typechecker/bound/BoundASTNode";
import { BoundBinaryOperation } from "../typechecker/bound/BoundBinaryOperation";
import { BoundBlock } from "../typechecker/bound/BoundBlock";
import { BoundBooleanLiteral } from "../typechecker/bound/BoundBooleanLiteral";
import { BoundCallExpression } from "../typechecker/bound/BoundCallExpression";
import { BoundFloatLiteral } from "../typechecker/bound/BoundFloatLiteral";
import { BoundForStatement } from "../typechecker/bound/BoundForStatement";
import { BoundFunctionDeclaration } from "../typechecker/bound/BoundFunctionDeclaration";
import { BoundIdentifier } from "../typechecker/bound/BoundIdentifier";
import { BoundIfExpression } from "../typechecker/bound/BoundIfExpression";
import { BoundIntegerLiteral } from "../typechecker/bound/BoundIntegerLiteral";
import { BoundLambdaExpression } from "../typechecker/bound/BoundLambdaExpression";
import { BoundLogicalOperation } from "../typechecker/bound/BoundLogicalOperation";
import { BoundMemberExpression } from "../typechecker/bound/BoundMemberExpression";
import { BoundNilLiteral } from "../typechecker/bound/BoundNilLiteral";
import { BoundNodes } from "../typechecker/bound/BoundNodes";
import { BoundObjectLiteral } from "../typechecker/bound/BoundObjectLiteral";
import { BoundObjectPattern } from "../typechecker/bound/BoundObjectPattern";
import { BoundParenthesizedExpression } from "../typechecker/bound/BoundParenthesizedExpression";
import { BoundProgramNode } from "../typechecker/bound/BoundProgramNode";
import { BoundReturnStatement } from "../typechecker/bound/BoundReturnStatement";
import { BoundSliceExpression } from "../typechecker/bound/BoundSliceExpression";
import { BoundStringLiteral } from "../typechecker/bound/BoundStringLiteral";
import { BoundSymbolLiteral } from "../typechecker/bound/BoundSymbolLiteral";
import { BoundTree } from "../typechecker/bound/BoundTree";
import { BoundTuple } from "../typechecker/bound/BoundTuple";
import { BoundTuplePattern } from "../typechecker/bound/BoundTuplePattern";
import { BoundUnaryOperation } from "../typechecker/bound/BoundUnaryOperation";
import { BoundVariableDeclaration } from "../typechecker/bound/BoundVariableDeclaration";
import { BoundVector } from "../typechecker/bound/BoundVector";

export class Emitter {
  constructor(public tree: BoundTree) {}

  public static new(tree: BoundTree) {
    return new Emitter(tree);
  }

  public emit() {
    const program = this.tree.root;

    return this.emitNode(program);
  }

  private emitNode(node: BoundASTNode): string {
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
      case BoundNodes.BoundSymbolLiteral:
        return this.emitSymbol(node as BoundSymbolLiteral);
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
      case BoundNodes.BoundBinaryOperation:
      case BoundNodes.BoundLogicalOperation:
        return this.emitBinaryOperation(
          node as BoundBinaryOperation | BoundLogicalOperation
        );
      case BoundNodes.BoundUnaryOperation:
        return this.emitUnaryOperation(node as BoundUnaryOperation);
      case BoundNodes.BoundIfExpression:
        return this.emitIfExpression(node as BoundIfExpression);
      case BoundNodes.BoundTuple:
        return this.emitTuple(node as BoundTuple);
      case BoundNodes.BoundVector:
        return this.emitVector(node as BoundVector);
      case BoundNodes.BoundSliceExpression:
        return this.emitSliceExpression(node as BoundSliceExpression);
      case BoundNodes.BoundForStatement:
        return this.emitForStatement(node as BoundForStatement);
      case BoundNodes.BoundTuplePattern:
        return this.emitTuplePattern(node as BoundTuplePattern);
      case BoundNodes.BoundObjectPattern:
        return this.emitObjectPattern(node as BoundObjectPattern);
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

  private emitSymbol(node: BoundSymbolLiteral) {
    // slice removes the colon
    return `Symbol.for("${node.token.value.slice(1)}")`;
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
        return `["${this.emitIdentifier(
          key as BoundIdentifier
        )}"]: ${this.emitNode(value)}`;
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

  private emitCallExpression(node: BoundCallExpression): string {
    let code = `${this.emitNode(node.func)}`;
    code += `(${node.args.map((arg) => this.emitNode(arg)).join(", ")})`;
    return code;
  }

  private emitAssignment(node: BoundAssignmentExpression): string {
    return `${this.emitNode(node.left)} ${node.operator} ${this.emitNode(
      node.right
    )};\n`;
  }

  private emitVariableDeclaration(node: BoundVariableDeclaration): string {
    if (node.constant) {
      return `const ${this.emitNode(node.assignment)}`;
    }

    return `let ${this.emitNode(node.assignment)}`;
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
        // this case is redundant, but I'm putting it here for emphasis
        if (expr.kind === BoundNodes.BoundReturnStatement) {
          return this.emitNode(expr);
        } else if (i === a.length - 1 && !node.statement) {
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

  private emitBinaryOperation(
    node: BoundBinaryOperation | BoundLogicalOperation
  ): string {
    switch (node.operator) {
      case "is":
        return `Object.is(${this.emitNode(node.left)}, ${this.emitNode(
          node.right
        )})`;
      case "and":
        return `${this.emitNode(node.left)} && ${this.emitNode(node.right)}`;
      case "or":
        return `${this.emitNode(node.left)} || ${this.emitNode(node.right)}`;
      default:
        return `${this.emitNode(node.left)} ${node.operator} ${this.emitNode(
          node.right
        )}`;
    }
  }

  private emitUnaryOperation(node: BoundUnaryOperation): string {
    switch (node.operator) {
      case "not":
        return `!${this.emitNode(node.expression)}`;
      default:
        return `${node.operator} ${this.emitNode(node.expression)}`;
    }
  }

  private emitIfExpression(node: BoundIfExpression): string {
    return `${this.emitNode(node.test)} ? ${this.emitNode(
      node.then
    )} : ${this.emitNode(node.else)}`;
  }

  private emitTuple(node: BoundTuple): string {
    return `[${node.values.map((v) => this.emitNode(v)).join(", ")}]`;
  }

  private emitVector(node: BoundVector): string {
    return `[${node.members.map((m) => this.emitNode(m)).join(", ")}]`;
  }

  private emitSliceExpression(node: BoundSliceExpression): string {
    return `${this.emitNode(node.obj)}[${this.emitNode(node.index)}]`;
  }

  private emitForStatement(node: BoundForStatement) {
    let bindings = "";
    let code = "";

    if (node.bindings.left instanceof BoundIdentifier) {
      bindings = node.bindings.left.name;
    } else {
      throw new Error(
        `Code emitting not yet implemented in for statement binding for ${node.bindings.kind}`
      );
    }

    code += `for (let ${bindings} of ${this.emitNode(node.bindings.right)}) {`;
    code += `${this.emitNode(node.body)}`;
    code += "}\n";

    return code;
  }

  private emitTuplePattern(node: BoundTuplePattern): string {
    return `[${node.names
      .map((n, i, a) => {
        if (node.rest && i === a.length - 1) {
          return `...${(n as BoundIdentifier).name}`;
        } else if (n instanceof BoundTuplePattern) {
          return this.emitTuplePattern(n);
        } else if (n instanceof BoundObjectPattern) {
          return this.emitObjectPattern(n);
        }

        return n.name;
      })
      .join(", ")}]`;
  }

  private emitObjectPattern(node: BoundObjectPattern): string {
    return `{${node.names
      .map((n, i, a) => {
        if (node.rest && i === a.length - 1) {
          return `...${(n as BoundIdentifier).name}`;
        }
        // handle cases with nested tuple and object properties

        return (n as BoundIdentifier).name;
      })
      .join(", ")}}`;
  }
}
