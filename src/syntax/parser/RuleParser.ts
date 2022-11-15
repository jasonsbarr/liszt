import { LexResult } from "../lexer/LexResult";
import { SrcLoc } from "../lexer/SrcLoc";
import { TokenNames } from "../lexer/TokenNames";
import { TokenTypes } from "../lexer/TokenTypes";
import { AssignmentExpression } from "./ast/AssignmentExpression";
import { ASTNode } from "./ast/ASTNode";
import { Block } from "./ast/Block";
import { FunctionDeclaration } from "./ast/FunctionDeclaration";
import { FunctionType } from "./ast/FunctionType";
import { Identifier } from "./ast/Identifier";
import { Parameter } from "./ast/Parameter";
import { ParameterType } from "./ast/ParameterType";
import { TypeAnnotation } from "./ast/TypeAnnotation";
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

  private parseFunctionDeclaration() {
    let token = this.reader.peek();
    const start = token.location;
    let parameters: Parameter[] = [];
    let returnType: TypeAnnotation | undefined;

    this.reader.skip(TokenNames.Def);
    this.reader.skip(TokenNames.LParen);
    token = this.reader.peek();

    while (token.name !== TokenNames.RParen) {
      parameters.push(this.parseFuncParameter());
      token = this.reader.peek();
    }

    this.reader.skip(TokenNames.RParen);
    token = this.reader.peek();

    if (token.name === TokenNames.Colon) {
      this.reader.skip(TokenNames.Colon);
      returnType = this.parseTypeAnnotation();
    }

    const body = this.parseBlock();
    const end = body.end;

    return FunctionDeclaration.new(parameters, body, start, end, returnType);
  }

  private parseKeyword(): ASTNode {
    const token = this.reader.peek();

    switch (token.name) {
      case TokenNames.Var:
        return this.parseVariableDeclaration(false);
      case TokenNames.Const:
        return this.parseVariableDeclaration(true);
      case TokenNames.Def:
        return this.parseFunctionDeclaration();
      default:
        throw new Error(`Parse rule not found for token name ${token.name}`);
    }
  }

  private parseFuncParameter() {
    const token = this.reader.peek();

    if (token.type !== TokenTypes.Identifier) {
      throw new Error(
        `Parameter name must be valid identifier; ${token.type} given`
      );
    }

    let name = this.parseExpr() as Identifier;
    const start = name.start;

    this.reader.skip(TokenNames.Colon);

    const annotation = this.parseTypeAnnotation();
    const end = annotation.end;

    return Parameter.new(name, start, end, annotation);
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
