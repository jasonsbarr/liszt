import { LexResult } from "../lexer/LexResult";
import { TokenNames } from "../lexer/TokenNames";
import { AnnotatedType } from "./ast/AnnotatedType";
import { AnyKeyword } from "./ast/AnyKeyword";
import { BooleanKeyword } from "./ast/BooleanKeyword";
import { FloatKeyword } from "./ast/FloatKeyword";
import { FunctionType } from "./ast/FunctionType";
import { Identifier } from "./ast/Identifier";
import { IntegerKeyword } from "./ast/IntegerKeyword";
import { NilLiteral } from "./ast/NilLiteral";
import { NumberKeyword } from "./ast/NumberKeyword";
import { ObjectPropertyType } from "./ast/ObjectPropertyType";
import { Parameter } from "./ast/Parameter";
import { ParameterType } from "./ast/ParameterType";
import { StringKeyword } from "./ast/StringKeyword";
import { TypeAnnotation } from "./ast/TypeAnnotation";
import { TypeLiteral } from "./ast/TypeLiteral";
import { LHVParser } from "./LHVParser";
import { SrcLoc } from "../lexer/SrcLoc";

export class TypeAnnotationParser extends LHVParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  private parseAnyKeyword() {
    const token = this.reader.next();
    return AnyKeyword.new(token, token.location);
  }

  private parseBooleanKeyword() {
    const token = this.reader.next();
    return BooleanKeyword.new(token, token.location);
  }

  private parseFloatKeyword() {
    const token = this.reader.next();
    return FloatKeyword.new(token, token.location);
  }

  private parseFunctionType(): FunctionType {
    // syntax: (param: type, ...) => returnType
    let token = this.reader.peek();
    const start = token.location;
    let parameters: ParameterType[] = [];

    this.reader.skip(TokenNames.LParen);
    token = this.reader.peek();

    while (token.name !== TokenNames.RParen) {
      let st = token.location;

      if (token.name !== TokenNames.Identifier) {
        throw new Error(
          `Function parameters must be valid identifiers; ${token.name} given`
        );
      }

      const param = this.parseType() as Identifier;
      this.reader.skip(TokenNames.Colon);
      const paramType = this.parseTypeAnnotation();
      const en = paramType.end;

      parameters.push(ParameterType.new(param, st, en, paramType));
      token = this.reader.peek();

      if (token.name !== TokenNames.RParen) {
        this.reader.skip(TokenNames.Comma);
        token = this.reader.peek();
      }
    }

    this.reader.skip(TokenNames.RParen);
    this.reader.skip(TokenNames.FatArrow);

    const returnType = this.parseTypeAnnotation();
    const end: SrcLoc = returnType.end;

    return FunctionType.new(parameters, returnType, start, end);
  }

  private parseIdentifier() {
    const token = this.reader.next();
    return Identifier.new(token, token.location);
  }

  private parseIntegerKeyword() {
    const token = this.reader.next();
    return IntegerKeyword.new(token, token.location);
  }

  private parseIntegerSingleton() {}

  private parseNilLiteral() {
    const token = this.reader.next();
    return NilLiteral.new(token, token.location);
  }

  private parseNumberKeyword() {
    const token = this.reader.next();
    return NumberKeyword.new(token, token.location);
  }

  private parseStringKeyword() {
    const token = this.reader.next();
    return StringKeyword.new(token, token.location);
  }

  public parseTypeAnnotation() {
    const type = this.parseType();
    return TypeAnnotation.new(type, type.start, type.end);
  }

  private parseType() {
    const token = this.reader.peek();

    switch (token.name) {
      case TokenNames.IntegerKeyword:
        return this.parseIntegerKeyword();
      case TokenNames.FloatKeyword:
        return this.parseFloatKeyword();
      case TokenNames.NumberKeyword:
        return this.parseNumberKeyword();
      case TokenNames.BooleanKeyword:
        return this.parseBooleanKeyword();
      case TokenNames.StringKeyword:
        return this.parseStringKeyword();
      case TokenNames.Nil:
        return this.parseNilLiteral();
      case TokenNames.Identifier:
        return this.parseIdentifier();
      case TokenNames.LBrace:
        return this.parseTypeLiteral();
      case TokenNames.AnyKeyword:
        return this.parseAnyKeyword();
      case TokenNames.LParen:
        return this.parseFunctionType();
      case TokenNames.Integer:
      case TokenNames.Float:
      case TokenNames.String:
      case TokenNames.True:
      case TokenNames.False:
      default:
        throw new Error(`No type annotation for token ${token.name}`);
    }
  }

  private parseTypeLiteral() {
    let token = this.reader.next();
    let properties: ObjectPropertyType[] = [];
    const start = token.location;
    token = this.reader.peek();

    while (token.name !== TokenNames.RBrace) {
      const st = token.location;

      if (token.name !== TokenNames.Identifier) {
        throw new Error(
          `Type literal property name must be a valid identifier; ${token.name} given`
        );
      }

      const propName = this.parseType() as Identifier;
      this.reader.skip(TokenNames.Colon);
      const propType = this.parseType();
      const en = propType.end;

      properties.push(ObjectPropertyType.new(propName, propType, st, en));
      token = this.reader.peek();

      if (token.name !== TokenNames.RBrace) {
        this.reader.skip(TokenNames.Comma);
        token = this.reader.peek();
      }
    }

    token = this.reader.next();
    const end = token.location;

    return TypeLiteral.new(properties, start, end);
  }
}
