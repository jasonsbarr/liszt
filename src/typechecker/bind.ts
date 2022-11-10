import { AsExpression } from "../syntax/parser/ast/AsExpression";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { BooleanLiteral } from "../syntax/parser/ast/BooleanLiteral";
import { FloatLiteral } from "../syntax/parser/ast/FloatLiteral";
import { Identifier } from "../syntax/parser/ast/Identifier";
import { IntegerLiteral } from "../syntax/parser/ast/IntegerLiteral";
import { LambdaExpression } from "../syntax/parser/ast/LambdaExpression";
import { MemberExpression } from "../syntax/parser/ast/MemberExpression";
import { ObjectLiteral } from "../syntax/parser/ast/ObjectLiteral";
import { ObjectProperty } from "../syntax/parser/ast/ObjectProperty";
import { StringLiteral } from "../syntax/parser/ast/StringLiteral";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { propType } from "./propType";
import { synth } from "./synth";
import { BoundASTNode } from "./tree/BoundASTNode";
import { BoundBooleanLiteral } from "./tree/BoundBooleanLiteral";
import { BoundFloatLiteral } from "./tree/BoundFloatLiteral";
import { BoundIdentifier } from "./tree/BoundIdentifier";
import { BoundIntegerLiteral } from "./tree/BoundIntegerLiteral";
import { BoundLambdaExpression } from "./tree/BoundLambdaExpression";
import { BoundMemberExpression } from "./tree/BoundMemberExpression";
import { BoundObjectLiteral } from "./tree/BoundObjectLiteral";
import { BoundObjectProperty } from "./tree/BoundObjectProperty";
import { BoundStringLiteral } from "./tree/BoundStringLiteral";
import { Type } from "./Type";
import { TypeEnv } from "./TypeEnv";
import { ObjectType } from "./Types";

export const bind = (node: ASTNode, env: TypeEnv, ty?: Type): BoundASTNode => {
  let key, value, synthType;
  switch (node.kind) {
    case SyntaxNodes.IntegerLiteral:
      return BoundIntegerLiteral.new(node as IntegerLiteral);
    case SyntaxNodes.FloatLiteral:
      return BoundFloatLiteral.new(node as FloatLiteral);
    case SyntaxNodes.BooleanLiteral:
      return BoundBooleanLiteral.new(node as BooleanLiteral);
    case SyntaxNodes.StringLiteral:
      return BoundStringLiteral.new(node as StringLiteral);
    case SyntaxNodes.Identifier:
      if (!ty) {
        // ty cannot be undefined below because if so, get method throws error
        ty = env.get((node as Identifier).name);
      }
      return BoundIdentifier.new(ty!, node as Identifier);
    case SyntaxNodes.ObjectProperty:
      synthType = synth((node as ObjectProperty).value, env);
      key = bind((node as ObjectProperty).key, env, synthType);
      value = bind((node as ObjectProperty).value, env);
      return BoundObjectProperty.new(
        key,
        value,
        synthType,
        node as ObjectProperty
      );
    case SyntaxNodes.ObjectLiteral:
      const properties: BoundObjectProperty[] = (
        node as ObjectLiteral
      ).properties.map((prop) => bind(prop, env) as BoundObjectProperty);
      if (!ty) {
        ty = synth(node, env);
      }
      return BoundObjectLiteral.new(ty, properties, node as ObjectLiteral);
    case SyntaxNodes.MemberExpression:
      const obj = (node as MemberExpression).object;
      const prop = (node as MemberExpression).property as Identifier;
      const synthObjType = synth(obj, env);
      const propertyType = propType(synthObjType as ObjectType, prop.name);

      if (!propertyType) {
        throw new Error(
          `Property ${
            (node as MemberExpression).property.name
          } does not exist on object`
        );
      }

      return BoundMemberExpression.new(
        propertyType,
        bind(obj, env, synthObjType),
        bind(prop, env, propertyType),
        node as MemberExpression
      );
    case SyntaxNodes.AsExpression:
      if (!ty) {
        ty = synth(node, env);
      }
      return bind((node as AsExpression).expression, env, ty);
    case SyntaxNodes.LambdaExpression:
      // gets extended lambdaEnvironment from type checker
      const lambdaType = synth(node, env) as Type.Function;
      const body = bind((node as LambdaExpression).body, env);
      return BoundLambdaExpression.new(
        node as LambdaExpression,
        body,
        lambdaType
      );
    default:
      throw new Error(`Cannot bind node of kind ${node.kind}`);
  }
};
