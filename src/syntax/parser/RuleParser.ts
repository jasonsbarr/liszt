import { LexResult } from "../lexer/LexResult";
import { TokenNames } from "../lexer/TokenNames";
import { TokenTypes } from "../lexer/TokenTypes";
import { AssignmentExpression } from "./ast/AssignmentExpression";
import { ASTNode } from "./ast/ASTNode";
import { Block } from "./ast/Block";
import { VariableDeclaration } from "./ast/VariableDeclaration";
import { ExpressionParser } from "./ExpressionParser";

export class RuleParser extends ExpressionParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  private parseBlock(): Block {
    let token = this.reader.peek();
    const start = token.location;
    let exprs: ASTNode[] = [];

    while (token.name !== TokenNames.End) {
      let expr = this.parseRule();
      exprs.push(expr);
      token = this.reader.peek();
    }

    this.reader.skip(TokenNames.End);
    const end = token.location;

    return Block.new(exprs, start, end);
  }

  private parseFunctionDefinition() {
    let token = this.reader.peek();
    const start = token.location;
  }

  private parseKeyword(): ASTNode {
    const token = this.reader.peek();

    switch (token.name) {
      case TokenNames.Var:
        return this.parseVariableDeclaration(false);
      case TokenNames.Const:
        return this.parseVariableDeclaration(true);
      case TokenNames.Def:
        return this.parseFunctionDefinition();
      default:
        throw new Error(`Parse rule not found for token name ${token.name}`);
    }
  }

  public parseRule() {
    const token = this.reader.peek();

    if (token.type === TokenTypes.Keyword) {
      return this.parseKeyword();
    }

    return this.parseExpression();
  }

  private parseVariableDeclaration(constant: boolean) {
    const token = this.reader.next();
    const start = token.location;
    const assignment = this.parseExpression();

    if (!(assignment instanceof AssignmentExpression)) {
      throw new Error(
        `Variable declaration must have an assignment as its expression`
      );
    }

    const end = assignment.end;

    return VariableDeclaration.new(assignment, constant, start, end);
  }
}
