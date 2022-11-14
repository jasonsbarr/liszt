import { LexResult } from "../lexer/LexResult";
import { TokenNames } from "../lexer/TokenNames";
import { TokenTypes } from "../lexer/TokenTypes";
import { AssignmentExpression } from "./ast/AssignmentExpression";
import { ASTNode } from "./ast/ASTNode";
import { VariableDeclaration } from "./ast/VariableDeclaration";
import { ExpressionParser } from "./ExpressionParser";

export class RuleParser extends ExpressionParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  private parseKeyword(): ASTNode {
    const token = this.reader.peek();

    switch (token.name) {
      case TokenNames.Var:
        return this.parseVariableDeclaration(false);
      case TokenNames.Const:
        return this.parseVariableDeclaration(true);
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
