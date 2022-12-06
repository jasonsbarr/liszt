import { LexResult } from "../lexer/LexResult";
import { SrcLoc } from "../lexer/SrcLoc";
import { TokenNames } from "../lexer/TokenNames";
import { TokenTypes } from "../lexer/TokenTypes";
import { AsExpression } from "./ast/AsExpression";
import { AssignmentExpression } from "./ast/AssignmentExpression";
import { ASTNode } from "./ast/ASTNode";
import { BooleanLiteral } from "./ast/BooleanLiteral";
import { CallExpression } from "./ast/CallExpression";
import { FloatLiteral } from "./ast/FloatLiteral";
import { Identifier } from "./ast/Identifier";
import { IntegerLiteral } from "./ast/IntegerLiteral";
import { LambdaExpression } from "./ast/LambdaExpression";
import { MemberExpression } from "./ast/MemberExpression";
import { NilLiteral } from "./ast/NilLiteral";
import { ObjectLiteral } from "./ast/ObjectLiteral";
import { ObjectProperty } from "./ast/ObjectProperty";
import { Parameter } from "./ast/Parameter";
import { ParenthesizedExpression } from "./ast/ParenthesizedExpression";
import { StringLiteral } from "./ast/StringLiteral";
import { SyntaxNodes } from "./ast/SyntaxNodes";
import { TypeAnnotation } from "./ast/TypeAnnotation";
import { Block } from "./ast/Block";
import { FunctionDeclaration } from "./ast/FunctionDeclaration";
import { ReturnStatement } from "./ast/ReturnStatement";
import { VariableDeclaration } from "./ast/VariableDeclaration";
import { TypeAnnotationParser } from "./TypeAnnotationParser";
import { BinaryOperation } from "./ast/BinaryOperation";
import { Token } from "../lexer/Token";
import { UnaryOperation } from "./ast/UnaryOperation";
import { LogicalOperation } from "./ast/LogicalOperation";
import { SymbolLiteral } from "./ast/SymbolLiteral";
import { IfExpression } from "./ast/IfExpression";
import { Tuple } from "./ast/Tuple";
import { VectorLiteral } from "./ast/ListLiteral";
import { SliceExpression } from "./ast/SliceExpression";
import { ForStatement } from "./ast/ForStatement";
import { SpreadOperation } from "./ast/SpreadOperation";
import { SetLiteral } from "./ast/SetLiteral";

const nudAttributes = {
  [TokenNames.Integer]: { prec: 0, assoc: "none" },
  [TokenNames.Float]: { prec: 0, assoc: "none" },
  [TokenNames.NaN]: { prec: 0, assoc: "none" },
  [TokenNames.Infinity]: { prec: 0, assoc: "none" },
  [TokenNames.String]: { prec: 0, assoc: "none" },
  [TokenNames.True]: { prec: 0, assoc: "none" },
  [TokenNames.False]: { prec: 0, assoc: "none" },
  [TokenNames.Nil]: { prec: 0, assoc: "none" },
  [TokenNames.Identifier]: { prec: 0, assoc: "none" },
  // I don't think associativity really matters for these unary operations
  [TokenNames.If]: { prec: 5, assoc: "left" },
  [TokenNames.ThreeDots]: { prec: 5, assoc: "right" },
  [TokenNames.Plus]: { prec: 60, assoc: "right" },
  [TokenNames.Minus]: { prec: 60, assoc: "right" },
  [TokenNames.Not]: { prec: 60, assoc: "right" },
  [TokenNames.TypeOf]: { prec: 60, assoc: "right" },
};

type nud = keyof typeof nudAttributes;

const ledAttributes = {
  [TokenNames.Or]: { prec: 15, assoc: "left" },
  [TokenNames.And]: { prec: 20, assoc: "left" },
  [TokenNames.Amp]: { prec: 25, assoc: "left" },
  [TokenNames.Pipe]: { prec: 25, assoc: "left" },
  [TokenNames.Is]: { prec: 25, assoc: "left" },
  [TokenNames.Is]: { prec: 30, assoc: "left" },
  [TokenNames.NotEqual]: { prec: 30, assoc: "left" },
  [TokenNames.DoubleEqual]: { prec: 30, assoc: "left" },
  [TokenNames.Is]: { prec: 30, assoc: "left" },
  [TokenNames.In]: { prec: 35, assoc: "left" },
  [TokenNames.GTE]: { prec: 35, assoc: "left" },
  [TokenNames.GT]: { prec: 35, assoc: "left" },
  [TokenNames.LTE]: { prec: 35, assoc: "left" },
  [TokenNames.LT]: { prec: 35, assoc: "left" },
  [TokenNames.LShift]: { prec: 37, assoc: "left" },
  [TokenNames.RShift]: { prec: 37, assoc: "left" },
  [TokenNames.As]: { prec: 40, assoc: "left" },
  [TokenNames.Plus]: { prec: 40, assoc: "left" },
  [TokenNames.Minus]: { prec: 40, assoc: "left" },
  [TokenNames.Times]: { prec: 40, assoc: "left" },
  [TokenNames.Div]: { prec: 45, assoc: "left" },
  [TokenNames.Mod]: { prec: 45, assoc: "left" },
  [TokenNames.Exp]: { prec: 50, assoc: "left" },
  [TokenNames.Dot]: { prec: 90, assoc: "left" },
  [TokenNames.LParen]: { prec: 90, assoc: "left" },
  [TokenNames.LBracket]: { prec: 90, assoc: "left" },
};

type led = keyof typeof ledAttributes;

const assignmentOps = {
  [TokenNames.Equals]: "Equals",
  [TokenNames.PlusEquals]: "PlusEquals",
  [TokenNames.MinusEquals]: "MinusEquals",
  [TokenNames.TimesEquals]: "TimesEquals",
  [TokenNames.DivEquals]: "DivEquals",
  [TokenNames.ModEquals]: "ModEquals",
};

export class StatementParser extends TypeAnnotationParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  private getLedPrecedence() {
    const token = this.reader.peek();
    return ledAttributes[token.name as led]?.prec ?? -1;
  }

  private getLedAssociativity() {
    const token = this.reader.peek();
    return ledAttributes[token.name as led]?.assoc ?? "left";
  }

  private getNudPrecedence(token: Token) {
    return nudAttributes[token.name as nud]?.prec ?? -1;
  }

  private parseAsExpression(left: ASTNode) {
    const start = left.start;
    this.reader.skip(TokenNames.As);
    const annotation = this.parseTypeAnnotation();
    const end = annotation.end;

    return AsExpression.new(left, annotation, start, end);
  }

  private parseAssign(left: ASTNode, type?: TypeAnnotation, constant = false) {
    left = this.parseLHV(left);
    let token = this.reader.peek();
    const prec = 5;
    // advance token stream
    this.reader.next();
    const right: ASTNode = this.parseExpression(prec);
    const start = left.start;
    const end = right.end;

    if (left instanceof Identifier) {
      left.constant = constant;
    }

    return AssignmentExpression.new(
      left,
      right,
      token.value,
      start,
      end,
      constant,
      type
    );
  }

  private parseAtom(): ASTNode {
    const token = this.reader.peek();
    switch (token.type) {
      case TokenTypes.Integer:
        this.reader.skip(TokenNames.Integer);
        return IntegerLiteral.new(token, token.location);
      case TokenTypes.Float:
        this.reader.skip(TokenNames.Float);
        return FloatLiteral.new(token, token.location);
      case TokenTypes.String:
        this.reader.skip(TokenNames.String);
        return StringLiteral.new(token, token.location);
      case TokenTypes.Boolean:
        this.reader.skip(
          token.name === TokenNames.True ? TokenNames.True : TokenNames.False
        );
        return BooleanLiteral.new(token, token.location);
      case TokenTypes.Symbol:
        this.reader.skip(TokenNames.Symbol);
        return SymbolLiteral.new(token, token.location);
      case TokenTypes.Nil:
        this.reader.skip(TokenNames.Nil);
        return NilLiteral.new(token, token.location);
      case TokenTypes.Identifier:
        this.reader.skip(TokenNames.Identifier);
        return Identifier.new(token, token.location);
      default: {
        switch (token.name) {
          case TokenNames.LParen:
            return this.or(
              this.parseLambda.bind(this),
              this.parseTuple.bind(this),
              this.parseParenthesizedExpression.bind(this)
            );
          case TokenNames.LBrace:
            return this.or(
              this.parseObjectLiteral.bind(this),
              this.parseSetLiteral.bind(this)
            );
          case TokenNames.Vec:
            return this.parseVectorLiteral();
          case TokenNames.Not:
          case TokenNames.Plus:
          case TokenNames.Minus:
          case TokenNames.TypeOf:
          case TokenNames.BNot:
          case TokenNames.ThreeDots:
            return this.parseUnaryOperation();
          default:
            throw new Error(
              `Unrecognized token (type: ${token.type}, name: ${token.name})`
            );
        }
      }
    }
  }

  private parseBinaryOperation(left: ASTNode) {
    const token = this.reader.peek();
    const start = token.location;
    const precedence = this.getLedPrecedence();
    const assoc = this.getLedAssociativity();

    // need to advance the token stream
    this.reader.next();

    const right = this.parseExpr(precedence - (assoc === "right" ? 1 : 0));
    const end = right.end;

    return BinaryOperation.new(left, right, token.value, start, end);
  }

  private parseBlock({ statement = false } = {}): Block {
    let token = this.reader.peek();
    const start = token.location;
    let exprs: ASTNode[] = [];

    while (token.name !== TokenNames.End) {
      let expr = this.parseStatement();

      if (statement && expr.kind === SyntaxNodes.ReturnStatement) {
        throw new Error(
          `Return statements are only allowed in function bodies`
        );
      }

      exprs.push(expr);
      token = this.reader.peek();
    }

    this.reader.skip(TokenNames.End);
    const end = token.location;

    return Block.new(exprs, start, end, statement);
  }

  private parseCallExpression(left: ASTNode) {
    if (left.kind === SyntaxNodes.LambdaExpression) {
      throw new Error(
        "Lambda expression must be wrapped in parentheses before immediately invoking it"
      );
    }

    const start = left.start;
    this.reader.skip(TokenNames.LParen);
    let token = this.reader.peek();
    let args: ASTNode[] = [];

    while (token.name !== TokenNames.RParen) {
      args.push(this.parseExpr());
      token = this.reader.peek();

      if (token.name !== TokenNames.RParen) {
        this.reader.skip(TokenNames.Comma);
        token = this.reader.peek();
      }
    }

    const end = token.location;
    this.reader.skip(TokenNames.RParen);

    return CallExpression.new(left, args, start, end);
  }

  protected parseExpr(rbp: number = 0, { constant = false } = {}) {
    let left = this.parseAtom();
    let prec = this.getLedPrecedence();

    if (left instanceof Identifier) {
      left.constant = constant;
    }

    while (rbp < prec) {
      left = this.parseLed(left);
      prec = this.getLedPrecedence();
    }

    return left;
  }

  public parseExpression(rbp: number = 0, { constant = false } = {}) {
    let [expr, type]: [ASTNode, TypeAnnotation | undefined] =
      this.parseExprWithMaybeTypeAnnotation(rbp, { constant });
    let token = this.reader.peek();

    if (token.name in assignmentOps) {
      return this.parseAssign(expr, type);
    }

    return expr;
  }

  private parseExprWithMaybeTypeAnnotation(rbp = 0, { constant = false } = {}) {
    let expr = this.parseExpr(rbp, { constant });
    let token = this.reader.peek();
    let type: TypeAnnotation | undefined;

    if (token.name === TokenNames.Colon) {
      this.reader.skip(TokenNames.Colon);
      type = this.parseTypeAnnotation();
    }

    return [expr, type] as [ASTNode, TypeAnnotation | undefined];
  }

  private parseForStatement() {
    let token = this.reader.peek();
    const start = token.location;

    this.reader.skip(TokenNames.For);

    let bindings = this.parseExpression() as BinaryOperation;
    bindings.left = this.parseLHV(bindings.left);

    if (bindings.operator !== "in") {
      throw new Error(`For statement must use in operator to bind its members`);
    }

    const body = this.parseBlock({ statement: true });
    const end = body.end;

    return ForStatement.new(bindings, body, start, end);
  }

  private parseFuncParameter() {
    let token = this.reader.peek();

    if (token.type !== TokenTypes.Identifier) {
      throw new Error(
        `Parameter name must be valid identifier; ${token.name} given`
      );
    }

    let name = this.parseExpr() as Identifier;
    const start = name.start;

    token = this.reader.peek();

    let annotation: TypeAnnotation | undefined;
    let end: SrcLoc;

    if (token.name === TokenNames.Colon) {
      this.reader.skip(TokenNames.Colon);

      annotation = this.parseTypeAnnotation();
      end = annotation.end;
    } else {
      end = name.end;
    }

    return Parameter.new(name, start, end, annotation);
  }

  private parseFunctionDeclaration() {
    let token = this.reader.peek();
    const start = token.location;
    let parameters: Parameter[] = [];
    let returnType: TypeAnnotation | undefined;

    this.reader.skip(TokenNames.Def);
    const name = this.parseAtom() as Identifier;
    this.reader.skip(TokenNames.LParen);
    token = this.reader.peek();

    while (token.name !== TokenNames.RParen) {
      parameters.push(this.parseFuncParameter());
      token = this.reader.peek();

      if (token.name !== TokenNames.RParen) {
        this.reader.skip(TokenNames.Comma);
        token = this.reader.peek();
      }
    }

    this.reader.skip(TokenNames.RParen);
    token = this.reader.peek();

    if (token.name === TokenNames.Colon) {
      this.reader.skip(TokenNames.Colon);
      returnType = this.parseTypeAnnotation();
    }

    const body = this.parseBlock();
    const end = body.end;

    return FunctionDeclaration.new(
      name,
      parameters,
      body,
      start,
      end,
      returnType
    );
  }

  private parseIfExpression() {
    const token = this.reader.peek();
    const start = token.location;
    const prec = this.getNudPrecedence(token);
    this.reader.skip(TokenNames.If);
    const ifNode = this.parseExpr(prec);
    const then = this.parseExpr(prec);

    // Else keyword is required
    this.reader.skip(TokenNames.Else);
    const elseNode = this.parseExpr(prec);
    const end = elseNode.end;

    return IfExpression.new(ifNode, then, elseNode, start, end);
  }

  private parseKeyword(): ASTNode {
    const token = this.reader.peek();

    switch (token.name) {
      case TokenNames.Var:
        return this.parseVariableDeclaration();
      case TokenNames.Const:
        return this.parseVariableDeclaration(true);
      case TokenNames.Def:
        return this.parseFunctionDeclaration();
      case TokenNames.Return:
        return this.parseReturnStatement();
      case TokenNames.If:
        return this.parseIfExpression();
      case TokenNames.For:
        return this.parseForStatement();
      default:
        return this.parseExpression();
    }
  }

  private parseLambda() {
    let token = this.reader.next();
    const start = token.location;

    token = this.reader.peek();
    let parameters: Parameter[] = [];

    while (token.name !== TokenNames.RParen) {
      parameters.push(this.parseParameter());
      token = this.reader.peek();

      if (token.name !== TokenNames.RParen) {
        this.reader.skip(TokenNames.Comma);
        token = this.reader.peek();
      }
    }

    this.reader.skip(TokenNames.RParen);
    token = this.reader.peek();

    let ret: TypeAnnotation | undefined;
    if (token.name === TokenNames.Colon) {
      this.reader.skip(TokenNames.Colon);
      ret = this.parseTypeAnnotation();
    }

    this.reader.skip(TokenNames.FatArrow);

    const body = this.parseExpr();
    const end = body.end;

    return LambdaExpression.new(parameters, body, start, end, ret);
  }

  private parseLed(left: ASTNode) {
    let token = this.reader.peek();

    switch (token.name) {
      case TokenNames.Dot:
        return this.parseMemberExpression(left);
      case TokenNames.LParen:
        return this.parseCallExpression(left);
      case TokenNames.As:
        return this.parseAsExpression(left);
      case TokenNames.Or:
      case TokenNames.And:
        return this.parseLogicalOperation(left);
      case TokenNames.DoubleEqual:
      case TokenNames.NotEqual:
      case TokenNames.Is:
      case TokenNames.LT:
      case TokenNames.LTE:
      case TokenNames.GT:
      case TokenNames.GTE:
      case TokenNames.Plus:
      case TokenNames.Minus:
      case TokenNames.Times:
      case TokenNames.Div:
      case TokenNames.Mod:
      case TokenNames.Exp:
      case TokenNames.In:
      case TokenNames.Amp:
      case TokenNames.Pipe:
      case TokenNames.RShift:
      case TokenNames.LShift:
      case TokenNames.Xor:
        return this.parseBinaryOperation(left);
      case TokenNames.LBracket:
        return this.parseSliceExpression(left);
      default:
        throw new Error(`Token ${token.name} does not have a left denotation`);
    }
  }

  private parseLogicalOperation(left: ASTNode) {
    const binaryOp = this.parseBinaryOperation(left);
    binaryOp.kind = SyntaxNodes.LogicalOperation;
    return LogicalOperation.new(
      binaryOp.left,
      binaryOp.right,
      binaryOp.operator,
      binaryOp.start,
      binaryOp.end
    );
  }

  private parseMemberExpression(left: ASTNode) {
    const prec = this.getLedPrecedence();
    this.reader.skip(TokenNames.Dot);
    const prop = this.parseExpr(prec);

    return MemberExpression.new(left, prop as Identifier, left.start, prop.end);
  }

  private parseObjectLiteral() {
    const start = this.reader.next();
    let properties: ObjectProperty[] = [];

    let token = this.reader.peek();
    while (token.name !== TokenNames.RBrace) {
      const st = token.location;
      // allow keywords as object property names
      const key =
        token.type === TokenTypes.Keyword
          ? this.parseIdentifier()
          : this.parseExpr();
      this.reader.skip(TokenNames.Colon);
      const value = this.parseExpr();
      token = this.reader.peek();
      const en = token.location;
      properties.push(ObjectProperty.new(key as Identifier, value, st, en));

      // note that this will allow trailing commas on object literals
      if (token.name !== TokenNames.RBrace) {
        this.reader.skip(TokenNames.Comma);
      }
    }
    const end = this.reader.next();

    return ObjectLiteral.new(properties, start.location, end.location);
  }

  private parseParameter() {
    let token = this.reader.peek();

    if (token.type !== TokenTypes.Identifier) {
      throw new Error(
        `Parameter name must be valid identifier; ${token.type} given`
      );
    }

    let name = this.parseExpr() as Identifier;
    let annotation: TypeAnnotation | undefined;
    const start = name.start;
    let end: SrcLoc;
    token = this.reader.peek();

    if (token.name === TokenNames.Colon) {
      this.reader.skip(TokenNames.Colon);
      annotation = this.parseTypeAnnotation();
      end = annotation.end;
    } else {
      annotation = undefined;
      end = name.end;
    }

    return Parameter.new(name, start, end, annotation);
  }

  private parseParenthesizedExpression() {
    const start = this.reader.next();
    const expr = this.parseExpression();
    const end = this.reader.next();
    return ParenthesizedExpression.new(expr, start.location, end.location);
  }

  // Should fix this to only allow in a function declaration body
  private parseReturnStatement() {
    const token = this.reader.peek();
    const start = token.location;

    this.reader.skip(TokenNames.Return);

    const expression = this.parseExpression();
    const end = expression.end;

    return ReturnStatement.new(expression, start, end);
  }

  private parseSetLiteral() {
    let token = this.reader.next();
    const start = token.location;
    let members: ASTNode[] = [];

    token = this.reader.peek();

    if (token.name === TokenNames.RBrace) {
      // empty set
      return SetLiteral.new(members, start, token.location);
    }

    while ((token.name as TokenNames) !== TokenNames.RBrace) {
      members.push(this.parseExpr());
      token = this.reader.peek();

      if (token.name !== TokenNames.RBrace) {
        this.reader.skip(TokenNames.Comma);
        token = this.reader.peek();
      }
    }

    const end = token.location;
    this.reader.skip(TokenNames.RBrace);

    return SetLiteral.new(members, start, end);
  }

  private parseSliceExpression(left: ASTNode) {
    const start = left.start;

    this.reader.skip(TokenNames.LBracket);

    const index = this.parseExpression();
    const token = this.reader.peek();
    const end = token.location;

    this.reader.skip(TokenNames.RBracket);

    return SliceExpression.new(left, index, start, end);
  }

  public parseStatement() {
    const token = this.reader.peek();

    if (token.type === TokenTypes.Keyword) {
      return this.parseKeyword();
    }

    return this.parseExpression();
  }

  private parseTuple() {
    let token = this.reader.next();
    const start = token.location;
    let end: SrcLoc;
    token = this.reader.peek();

    if (token.name === TokenNames.RParen) {
      // empty tuple
      end = token.location;
      return Tuple.new([], start, end);
    }

    const first = this.parseExpr();
    const values = [first];

    // Tuple must have a comma even if there's only one element
    // no trailing commas though
    token = this.reader.peek();

    if (token.name !== TokenNames.Comma) {
      // We'll be using the or method to parse tuples, so this will rewind the input
      throw new Error("First tuple element must be followed by a comma");
    }

    this.reader.skip(TokenNames.Comma);

    while (token.name !== TokenNames.RParen) {
      token = this.reader.peek();

      if (token.name !== TokenNames.RParen) {
        values.push(this.parseExpr());
        token = this.reader.peek();

        if (token.name === TokenNames.Comma) {
          // allows but does not require trailing comma
          this.reader.skip(TokenNames.Comma);
          token = this.reader.peek();
        }
      }
    }

    this.reader.skip(TokenNames.RParen);
    end = token.location;

    return Tuple.new(values, start, end);
  }

  private parseUnaryOperation() {
    const token = this.reader.next();
    const start = token.location;
    const prec = this.getNudPrecedence(token);
    const expression = this.parseExpr(prec);
    const end = expression.end;

    if (
      token.name === TokenNames.ThreeDots &&
      expression.kind !== SyntaxNodes.Identifier
    ) {
      throw new Error(`Spread operator can only be used with an identifier`);
    }

    return token.name === TokenNames.ThreeDots
      ? SpreadOperation.new(expression as Identifier, start, end)
      : UnaryOperation.new(expression, token.value, start, end);
  }

  private parseVariableDeclaration(constant = false) {
    const token = this.reader.next();
    const start = token.location;
    const assignment = this.parseExpression() as AssignmentExpression;
    assignment.constant = constant;

    if (!(assignment instanceof AssignmentExpression)) {
      throw new Error(
        `Variable declaration must have an assignment as its expression`
      );
    }

    if (assignment.left instanceof Identifier) {
      assignment.left.constant = constant;
    }

    const end = assignment.end;

    return VariableDeclaration.new(assignment, constant, start, end);
  }

  private parseVectorLiteral() {
    let token = this.reader.next();
    const start = token.location;
    let end: SrcLoc;

    this.reader.skip(TokenNames.LBracket);
    token = this.reader.peek();

    if (token.name === TokenNames.RBracket) {
      // return empty list
      end = token.location;
      return VectorLiteral.new([], start, end);
    }

    let members: ASTNode[] = [];

    while ((token.name as TokenNames) !== TokenNames.RBracket) {
      let member = this.parseExpr();
      members.push(member);
      token = this.reader.peek();

      if (token.name !== TokenNames.RBracket) {
        this.reader.skip(TokenNames.Comma);
        token = this.reader.peek();
      }
    }

    token = this.reader.next();
    end = token.location;

    return VectorLiteral.new(members, start, end);
  }
}
