import { AsExpression } from "../syntax/parser/ast/AsExpression";
import { AssignmentExpression } from "../syntax/parser/ast/AssignmentExpression";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { BooleanLiteral } from "../syntax/parser/ast/BooleanLiteral";
import { CallExpression } from "../syntax/parser/ast/CallExpression";
import { FloatLiteral } from "../syntax/parser/ast/FloatLiteral";
import { Identifier } from "../syntax/parser/ast/Identifier";
import { IntegerLiteral } from "../syntax/parser/ast/IntegerLiteral";
import { LambdaExpression } from "../syntax/parser/ast/LambdaExpression";
import { MemberExpression } from "../syntax/parser/ast/MemberExpression";
import { ObjectLiteral } from "../syntax/parser/ast/ObjectLiteral";
import { ObjectProperty } from "../syntax/parser/ast/ObjectProperty";
import { ParenthesizedExpression } from "../syntax/parser/ast/ParenthesizedExpression";
import { StringLiteral } from "../syntax/parser/ast/StringLiteral";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { VariableDeclaration } from "../syntax/parser/ast/VariableDeclaration";
import { isSubtype } from "./isSubtype";
import { propType } from "./propType";
import { synth } from "./synth";
import { BoundAssignmentExpression } from "./bound/BoundAssignmentExpression";
import { BoundASTNode } from "./bound/BoundASTNode";
import { BoundBooleanLiteral } from "./bound/BoundBooleanLiteral";
import { BoundCallExpression } from "./bound/BoundCallExpression";
import { BoundFloatLiteral } from "./bound/BoundFloatLiteral";
import { BoundIdentifier } from "./bound/BoundIdentifier";
import { BoundIntegerLiteral } from "./bound/BoundIntegerLiteral";
import { BoundLambdaExpression } from "./bound/BoundLambdaExpression";
import { BoundMemberExpression } from "./bound/BoundMemberExpression";
import { BoundObjectLiteral } from "./bound/BoundObjectLiteral";
import { BoundObjectProperty } from "./bound/BoundObjectProperty";
import { BoundParenthesizedExpression } from "./bound/BoundParenthesizedExpression";
import { BoundStringLiteral } from "./bound/BoundStringLiteral";
import { BoundVariableDeclaration } from "./bound/BoundVariableDeclaration";
import { Type } from "./Type";
import { TypeEnv } from "./TypeEnv";
import { ObjectType } from "./Types";
import { FunctionDeclaration } from "../syntax/parser/ast/FunctionDeclaration";
import { BoundFunctionDeclaration } from "./bound/BoundFunctionDeclaration";
import { BoundParameter } from "./bound/BoundParameter";
import { BoundBlock } from "./bound/BoundBlock";
import { Block } from "../syntax/parser/ast/Block";
import { BoundReturnStatement } from "./bound/BoundReturnStatement";
import { ReturnStatement } from "../syntax/parser/ast/ReturnStatement";

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

      // Should never happen
      if (!isSubtype(ty!, propertyType)) {
        throw new Error(
          `Synthesized type ${ty} is not compatible with synthesized property type ${propertyType}`
        );
      }

      return BoundMemberExpression.new(
        ty!, // is being passed in by TypeChecker
        bind(obj, env, synthObjType),
        bind(prop, env, propertyType),
        node as MemberExpression
      );
    case SyntaxNodes.AsExpression:
      if (!ty) {
        ty = synth(node, env);
      }
      return bind((node as AsExpression).expression, env, ty);
    case SyntaxNodes.ParenthesizedExpression:
      if (!ty) {
        ty = synth((node as ParenthesizedExpression).expression, env);
      }

      return BoundParenthesizedExpression.new(
        bind((node as ParenthesizedExpression).expression, env, ty),
        node.start,
        node.end
      );
    case SyntaxNodes.LambdaExpression:
      // gets extended lambdaEnvironment from type checker
      const lambdaBody = bind((node as LambdaExpression).body, env);
      return BoundLambdaExpression.new(
        node as LambdaExpression,
        lambdaBody,
        ty! as Type.Function
      );
    case SyntaxNodes.CallExpression:
      const callArgs = (node as CallExpression).args.map((arg) =>
        bind(arg, env)
      );
      const callFunc = bind((node as CallExpression).func, env);

      if (!ty) {
        // Shouldn't need this because TypeChecker should pass this in
        ty = synth(node, env);
      }

      return BoundCallExpression.new(
        callArgs,
        callFunc,
        ty,
        node.start,
        node.end
      );
    case SyntaxNodes.AssignmentExpression:
      if (node instanceof AssignmentExpression) {
        // Type checker always passes in the type here
        const isDefined = env.lookup((node.left as Identifier).name);

        if (isDefined) {
          const checkType = env.get((node.left as Identifier).name)!;

          if (!isSubtype(ty!, checkType)) {
            throw new Error(
              `Cannot assign value of type ${ty} to variable of type ${checkType}`
            );
          }
        }

        const left = bind(node.left, env, ty!);
        const right = bind(node.right, env, ty!);
        return BoundAssignmentExpression.new(
          left,
          right,
          node.operator,
          node.start,
          node.end,
          ty!
        );
      }
      // Should never happen
      throw new Error("WTF");
    case SyntaxNodes.VariableDeclaration:
      if (node instanceof VariableDeclaration) {
        // Type checker always passes in the type here
        const assignment = bind(
          node.assignment,
          env,
          ty!
        ) as BoundAssignmentExpression;
        return BoundVariableDeclaration.new(
          assignment,
          node.constant,
          ty!,
          node.start,
          node.end
        );
      }
      // Should never happen
      throw new Error("Again, WTF?");
    case SyntaxNodes.FunctionDeclaration:
      if (node instanceof FunctionDeclaration) {
        // gets extended environment from type checker
        const name = bind(node.name, env, ty!) as BoundIdentifier;
        const boundParams = node.params.map((p) => BoundParameter.new(p));
        const boundBody = bind(node.body, env) as BoundBlock;

        return BoundFunctionDeclaration.new(
          name,
          boundParams,
          boundBody,
          // guaranteed to be passed in from type checker
          // will be a function type
          ty!,
          node.start,
          node.end
        );
      }
      // Should never happen
      throw new Error("WTF, indeed?");
    case SyntaxNodes.Block:
      if (node instanceof Block) {
        const exprs = node.expressions;
        const boundExprs = exprs.map((expr, i, a) => {
          let type = synth(expr, env);

          if (expr.kind === SyntaxNodes.ReturnStatement || i === a.length - 1) {
            // ty will be passed in from the type checker
            if (!isSubtype(type, ty!)) {
              throw new Error(`Cannot use ${type} as a subtype of ${ty}`);
            }
          }

          return bind(expr, env, type);
        });

        return BoundBlock.new(boundExprs, ty!, node.start, node.end);
      }
      throw new Error("WTAF");
    case SyntaxNodes.ReturnStatement:
      // ty will be passed in from type checker
      const boundExpr = bind((node as ReturnStatement).expression, env, ty!);
      return BoundReturnStatement.new(boundExpr, ty!, node.start, node.end);
    default:
      throw new Error(`Cannot bind node of kind ${node.kind}`);
  }
};
