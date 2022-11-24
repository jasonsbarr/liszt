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
import { SingletonType } from "./ast/SingletonType";
import { SymbolKeyword } from "./ast/SymbolKeyword";
import { CompoundType } from "./ast/CompoundType";
import { SyntaxNodes } from "./ast/SyntaxNodes";
import { NeverKeyword } from "./ast/NeverKeyword";
import { UnknownKeyword } from "./ast/UnknownKeyword";
import { TypeVariable } from "./ast/TypeVariable";
import { TokenTypes } from "../lexer/TokenTypes";

enum CompoundTypes {
  Intersection = "Intersection",
  Union = "Union",
}

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

  private parseBooleanSingleton() {
    const token = this.reader.next();
    return SingletonType.new("Boolean", token, token.location);
  }

  private parseFloatKeyword() {
    const token = this.reader.next();
    return FloatKeyword.new(token, token.location);
  }

  private parseFloatSingleton() {
    const token = this.reader.next();
    return SingletonType.new("Float", token, token.location);
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

      const param = this.parseTypePrimitive() as Identifier;
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

  private parseIntegerSingleton() {
    const token = this.reader.next();
    return SingletonType.new("Integer", token, token.location);
  }

  private parseNeverKeyword() {
    const token = this.reader.next();
    return NeverKeyword.new(token, token.location);
  }

  private parseNilLiteral() {
    const token = this.reader.next();
    return NilLiteral.new(token, token.location);
  }

  private parseNumberKeyword() {
    const token = this.reader.next();
    return NumberKeyword.new(token, token.location);
  }

  private parseParenthesizedAnnotation() {
    // need to advance token stream
    this.reader.skip(TokenNames.LParen);
    const annotation = this.parseTypeAnnotation();
    // need to move past closing paren
    this.reader.skip(TokenNames.RParen);

    return annotation;
  }

  private parseStringKeyword() {
    const token = this.reader.next();
    return StringKeyword.new(token, token.location);
  }

  private parseStringSingleton() {
    const token = this.reader.next();
    return SingletonType.new("String", token, token.location);
  }

  private parseSymbolKeyword() {
    const token = this.reader.next();
    return SymbolKeyword.new(token, token.location);
  }

  private parseTypePrimitive() {
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
      case TokenNames.SymbolKeyword:
        return this.parseSymbolKeyword();
      case TokenNames.Nil:
        return this.parseNilLiteral();
      case TokenNames.Identifier:
        return this.parseIdentifier();
      case TokenNames.AnyKeyword:
        return this.parseAnyKeyword();
      case TokenNames.NeverKeyword:
        return this.parseNeverKeyword();
      case TokenNames.UnknownKeyword:
        return this.parseUnknownKeyword();
      case TokenNames.Integer:
        return this.parseIntegerSingleton();
      case TokenNames.Float:
        return this.parseFloatSingleton();
      case TokenNames.String:
        return this.parseStringSingleton();
      case TokenNames.True:
      case TokenNames.False:
        return this.parseBooleanSingleton();
      case TokenNames.LBrace:
        return this.parseTypeLiteral();
      case TokenNames.LParen:
        return this.or(
          this.parseParenthesizedAnnotation.bind(this),
          this.parseFunctionType.bind(this)
        );
      case TokenNames.TypeVariable:
        return this.parseTypeVariable();
      default:
        switch (token.type) {
          // allow keywords as object properties
          case TokenTypes.Keyword:
            return this.parseIdentifier();
          default:
            throw new Error(`No type annotation for token ${token.name}`);
        }
    }
  }

  public parseTypeAnnotation(): TypeAnnotation {
    const type: AnnotatedType | TypeAnnotation = this.parseTypePrimitive() as
      | AnnotatedType
      | TypeAnnotation;

    let token = this.reader.peek();

    if (token.name === TokenNames.Amp || token.name === TokenNames.Pipe) {
      let types: (AnnotatedType | TypeAnnotation)[] = [type];
      let compoundType =
        token.name === TokenNames.Amp
          ? CompoundTypes.Intersection
          : CompoundTypes.Union;

      // need to advance the token stream
      this.reader.next();

      while (token.name === TokenNames.Amp || token.name === TokenNames.Pipe) {
        // any is hack because type system doesn't like having both
        // AnnotatedType and TypeAnnotations in the same array
        types.push(this.parseTypePrimitive() as any);
        token = this.reader.peek();
      }

      const annotations = types.map((ty) => {
        if (ty instanceof TypeAnnotation) {
          return ty;
        }
        return TypeAnnotation.new(ty as AnnotatedType, ty.start, ty.end);
      });
      const annotatedType = CompoundType.new(
        compoundType === CompoundTypes.Union
          ? SyntaxNodes.UnionType
          : SyntaxNodes.IntersectionType,
        annotations,
        type.start,
        types[types.length - 1].end
      );

      return TypeAnnotation.new(
        annotatedType,
        annotatedType.start,
        annotatedType.end
      );
    }

    return TypeAnnotation.new(type as AnnotatedType, type.start, type.end);
  }

  private parseTypeLiteral() {
    let token = this.reader.next();
    let properties: ObjectPropertyType[] = [];
    const start = token.location;
    token = this.reader.peek();

    while (token.name !== TokenNames.RBrace) {
      const st = token.location;
      const propName = this.parseTypePrimitive() as Identifier;
      this.reader.skip(TokenNames.Colon);
      const propType = this.parseTypePrimitive();
      const en = propType.end;

      properties.push(
        ObjectPropertyType.new(propName, propType as AnnotatedType, st, en)
      );
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

  private parseTypeVariable() {
    const token = this.reader.next();
    const start = token.location;
    const end = SrcLoc.new(
      start.pos + token.value.length,
      start.line,
      start.col + token.value.length
    );

    return TypeVariable.new(token.value, start, end);
  }

  private parseUnknownKeyword() {
    const token = this.reader.next();
    return UnknownKeyword.new(token, token.location);
  }
}
